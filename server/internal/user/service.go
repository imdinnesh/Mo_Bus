package user

import (
	"fmt"
	"net/http"
	"time"

	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
	"github.com/imdinnesh/mobusapi/pkg/crypto"
	"github.com/imdinnesh/mobusapi/pkg/email"
	"github.com/imdinnesh/mobusapi/pkg/jwt"
	"github.com/imdinnesh/mobusapi/pkg/otp"
	"github.com/imdinnesh/mobusapi/pkg/smtp"
	"github.com/imdinnesh/mobusapi/redis"
	"gorm.io/gorm"
)

type Service interface {
	Register(req SignUpRequest) (*SignUpResponse, error)
	VerifyUser(req VerifyUserRequest) (*VerifyUserResponse, error)
	ResendOtp(req ResendOTPRequest) (*ResendOTPResponse, error)
	SignIn(req SignInRequest) (*SignInResponse, error)
	Profile(userId uint) (*ProfileResposne, error)
	ResetPassword(userId uint,req ResetPasswordRequest) (*ResetPasswordResponse, error)
	RefreshToken(refreshToken string) (*RefreshTokenResponse, error)
	Logout(token string,userID uint,deviceID string)(*LogoutResponse,error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) Register(req SignUpRequest) (*SignUpResponse, error) {
	user := &models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: req.Password,
		Balance:  0.0,
		Role:     "user",
	}

	existingUser, err := s.repo.FindByEmail(user.Email)
	if err != nil && err != gorm.ErrRecordNotFound {
		return nil, apierror.New("Failed to check user existence", http.StatusInternalServerError)
	}
	if existingUser != nil && existingUser.ID != 0 {
		errorMessage := fmt.Sprintf("User with email %s already exists", user.Email)
		return nil, apierror.New(errorMessage, http.StatusConflict)
	}

	err = s.repo.Create(user)
	if err != nil {
		return nil, apierror.New("Failed to create user", http.StatusInternalServerError)
	}

	otp := otp.GenerateOTP()
	err = redis.StoreOTP(user.Email, otp, 5*time.Minute)
	if err != nil {
		return nil, apierror.New("Failed to store OTP", http.StatusInternalServerError)
	}

	email := email.NewOnBoardingEmail(user.Name, otp)
	go smtp.SendEmail(user.Email, email.Subject, email.Body)

	return &SignUpResponse{
		Status:  "success",
		Message: "A verification email has been sent. Please verify your email.",
	}, nil

}

func (s *service) VerifyUser(req VerifyUserRequest) (*VerifyUserResponse, error) {

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}

	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}

	if user.VerifiedStatus {
		return nil, apierror.New("User already verified", http.StatusConflict)
	}

	verified, err := redis.VerifyOTP(req.Email, req.OTP)
	if err != nil {
		return nil, apierror.New("Invalid or expired OTP", http.StatusBadRequest)
	}

	if !verified {
		return nil, apierror.New("Invalid or expired OTP", http.StatusBadRequest)
	}

	user.VerifiedStatus = true
	err = s.repo.Update(user)

	if err != nil {
		return nil, apierror.New("Failed to update user", http.StatusInternalServerError)
	}

	return &VerifyUserResponse{
		Status:  "success",
		Message: "User verified successfully",
	}, nil

}

func (s *service) ResendOtp(req ResendOTPRequest) (*ResendOTPResponse, error) {

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}
	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}

	if user.VerifiedStatus {
		return nil, apierror.New("User already verified", http.StatusConflict)
	}

	// Check if the user can resend OTP
	canResend := redis.CanResendOTP(user.Email, 30*time.Second)
	if !canResend {
		return nil, apierror.New("Please wait before requesting a new OTP", http.StatusTooManyRequests)
	}

	otp := otp.GenerateOTP()
	err = redis.StoreOTP(user.Email, otp, 5*time.Minute)
	if err != nil {
		return nil, apierror.New("Failed to store OTP", http.StatusInternalServerError)
	}

	email := email.NewOnBoardingEmail(user.Name, otp)
	go smtp.SendEmail(user.Email, email.Subject, email.Body)
	return &ResendOTPResponse{
		Status:  "success",
		Message: "A new OTP has been sent to your email",
	}, nil

}

func (s *service) SignIn(req SignInRequest) (*SignInResponse, error) {

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, apierror.New("Error fetching user", http.StatusInternalServerError)
	}
	if user == nil || user.Password != req.Password {
		return nil, apierror.New("Invalid credentials", http.StatusUnauthorized)
	}

	accessToken, err := jwt.CreateToken(user.Email, user.ID, req.DeviceId, user.Role)
	if err != nil {
		return nil, apierror.New("Error generating access token", http.StatusInternalServerError)
	}

	refreshToken, err := jwt.CreateRefreshToken(user.Email, req.DeviceId, user.Role)
	if err != nil {
		return nil, apierror.New("Error generating refresh token", http.StatusInternalServerError)
	}

	encryptedToken, err := crypto.EncryptToken(refreshToken)
	if err != nil {
		return nil, apierror.New("Error encrypting refresh token", http.StatusInternalServerError)
	}

	err = s.repo.SaveRefreshToken(&models.RefreshToken{
		UserID:                user.ID,
		EncryptedRefreshToken: encryptedToken,
		ExpiresAt:             time.Now().Add(7 * 24 * time.Hour),
		DeviceID:              req.DeviceId,
	})
	if err != nil {
		return nil, apierror.New("Failed to save refresh token", http.StatusInternalServerError)
	}

	return &SignInResponse{
		Status:       "success",
		Message:      "Signed in successfully",
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}

func (s *service) Profile(userId uint) (*ProfileResposne, error) {
	user, err := s.repo.FindById(userId)
	if err != nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}
	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}

	return &ProfileResposne{
		Status:  "success",
		Message: "User profile fetched successfully",
		Balance: user.Balance,
		Role:    user.Role,
	}, nil

}

func (s *service) ResetPassword(userId uint,req ResetPasswordRequest) (*ResetPasswordResponse, error) {
	user, err := s.repo.FindById(userId)
	if err != nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}
	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}
	if user.Password != req.OldPassword {
		return nil, apierror.New("Old password is incorrect", http.StatusBadRequest)
	}

	user.Password = req.NewPassword
	err = s.repo.Update(user)
	if err != nil {
		return nil, apierror.New("Failed to update password", http.StatusInternalServerError)
	}

	return &ResetPasswordResponse{
		Status:  "success",
		Message: "Password reset successfully",
	}, nil
}

func (s *service) RefreshToken( refreshToken string) (*RefreshTokenResponse, error) {
	newAccessToken,newRefreshToken,err:=jwt.RefreshAccessToken(refreshToken)
	if err != nil {
		return nil, apierror.New("Invalid refresh token", http.StatusUnauthorized)
	}
	return &RefreshTokenResponse{
		Status:       "success",
		Message:      "Token refreshed successfully",
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	}, nil



}

func (s *service) Logout(token string,userID uint,deviceID string) (*LogoutResponse, error) {
	expiryTime, err := jwt.GetExpiryTime(token)
	if err != nil {
		return nil, apierror.New("Invalid token", http.StatusUnauthorized)
	}
	timeUntilExpiry := time.Until(expiryTime)
	// Blacklist the token for the specific user and device
	err = redis.BlacklistToken(userID, deviceID, token, timeUntilExpiry)
	if err != nil {
		return nil, apierror.New("Failed to blacklist token", http.StatusInternalServerError)
	}

	err=s.repo.DeleteRefreshToken(&models.RefreshToken{},userID,deviceID)
	if err != nil {
		return nil, apierror.New("Failed to delete refresh token", http.StatusInternalServerError)
	}
	return &LogoutResponse{
		Status:  "success",
		Message: "Logged out successfully",
	}, nil


}