package user

import (
	"fmt"
	"net/http"
	"time"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
	"github.com/imdinnesh/mobusapi/pkg/email"
	"github.com/imdinnesh/mobusapi/pkg/otp"
	"github.com/imdinnesh/mobusapi/pkg/smtp"
	"github.com/imdinnesh/mobusapi/redis"
	"gorm.io/gorm"
)

type Service interface {
	Register(req SignUpRequest) (*SignUpResponse, error)
	VerifyUser(req VerifyUserRequest) (*VerifyUserResponse, error)
	ResendOtp(req ResendOTPRequest)(*ResendOTPResponse,error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) Register(req SignUpRequest) (*SignUpResponse, error) {
	user := &User{
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
        errorMessage:=fmt.Sprintf("User with email %s already exists", user.Email)
		return nil, apierror.New(errorMessage, http.StatusConflict)
	}

	err = s.repo.Create(user)
	if err != nil {
		return nil, apierror.New("Failed to create user", http.StatusInternalServerError)
	}

    otp:=otp.GenerateOTP()
    err=redis.StoreOTP(user.Email, otp, 5*time.Minute)
    if err != nil {
        return nil, apierror.New("Failed to store OTP", http.StatusInternalServerError)
    }

    email:=email.NewOnBoardingEmail(user.Name, otp)
    go smtp.SendEmail(user.Email, email.Subject, email.Body)

	return &SignUpResponse{
		Status:  "success",
		Message: "A verification email has been sent. Please verify your email.",
	}, nil

}

func (s *service) VerifyUser(req VerifyUserRequest)(*VerifyUserResponse,error){

	user,err:=s.repo.FindByEmail(req.Email)
	if err != nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}

	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}

	if user.VerifiedStatus{
		return nil, apierror.New("User already verified", http.StatusConflict)
	}

	verified,err:=redis.VerifyOTP(req.Email,req.OTP)
	if err != nil {
		return nil, apierror.New("Invalid or expired OTP", http.StatusBadRequest)
	}

	if !verified {
		return nil, apierror.New("Invalid or expired OTP", http.StatusBadRequest)
	}
	
	user.VerifiedStatus=true
	err=s.repo.Update(user)

	if err != nil {
		return nil, apierror.New("Failed to update user", http.StatusInternalServerError)
	}

	return &VerifyUserResponse{
		Status:  "success",
		Message: "User verified successfully",
	}, nil
	
}

func (s *service) ResendOtp(req ResendOTPRequest)(*ResendOTPResponse,error){

	user,err:=s.repo.FindByEmail(req.Email)
	if err!= nil {
		return nil, apierror.New("Failed to find user", http.StatusInternalServerError)
	}
	if user == nil {
		return nil, apierror.New("User not found", http.StatusNotFound)
	}

	if user.VerifiedStatus{
		return nil, apierror.New("User already verified", http.StatusConflict)
	}

	// Check if the user can resend OTP
	canResend := redis.CanResendOTP(user.Email, 30*time.Second)
	if !canResend {
		return nil, apierror.New("Please wait before requesting a new OTP", http.StatusTooManyRequests)
	}

	otp:=otp.GenerateOTP()
	err=redis.StoreOTP(user.Email, otp, 5*time.Minute)
	if err != nil {
		return nil, apierror.New("Failed to store OTP", http.StatusInternalServerError)
	}

	email:=email.NewOnBoardingEmail(user.Name, otp)
	go smtp.SendEmail(user.Email, email.Subject, email.Body)
	return &ResendOTPResponse{
		Status:  "success",
		Message: "A new OTP has been sent to your email",
	}, nil

}

