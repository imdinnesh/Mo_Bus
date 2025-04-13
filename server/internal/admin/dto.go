package admin

type SignUpRequest struct {
	Name     string `json:"name" binding:"required,min=3,max=100"`
	Email   string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type SignUpResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`

}

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	DeviceId string `json:"device_id"`
}

type SignInResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	AccessToken   string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type VerifyUserRequest struct {
	Email string `json:"email" binding:"required,email"`
	OTP    string `json:"otp" binding:"required"`
}

type VerifyUserResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ResendOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResendOTPResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type ProfileResposne struct{
	Status  string `json:"status"`
	Message string `json:"message"`
	Balance float64 `json:"balance"`
	Role string `json:"role"`
}

type ResetPasswordRequest struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

type ResetPasswordResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type RefreshTokenResponse struct {
	Status      string `json:"status"`
	Message     string `json:"message"`
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type LogoutResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}


