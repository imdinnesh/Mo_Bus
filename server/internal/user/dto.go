package user

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
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
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


