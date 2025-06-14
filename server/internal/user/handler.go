package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) CreateUser(ctx *gin.Context) {
	req := SignUpRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}

	response, err := h.service.Register(req)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		// Fallback for unknown error types
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	ctx.JSON(http.StatusCreated, response)
}

func (h *Handler)VerifyUser(ctx *gin.Context){
	req:=VerifyUserRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}

	response,err:=h.service.VerifyUser(req)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		// Fallback for unknown error types
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)


}

func (h *Handler) ResendOTP(ctx *gin.Context) {
	req := ResendOTPRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}

	response, err := h.service.ResendOtp(req)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		// Fallback for unknown error types
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) SignIn(ctx *gin.Context) {
	req :=SignInRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}
	response, err := h.service.SignIn(req)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {

			if apiErr.StatusCode==http.StatusForbidden{
				ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message, "email": req.Email})
				return
			}

			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Set refresh token in cookie
    ctx.SetCookie(
        "refresh_token",
        response.RefreshToken,
        7*24*60*60, // 7 days
        "/",
        "",
        true,  // secure
        true,  // httpOnly
    )

	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) GetProfile(ctx *gin.Context) {
	userId:=ctx.GetUint("userId")
	response,err:=h.service.Profile(userId)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) ResetPassword(ctx *gin.Context) {
	userId:=ctx.GetUint("userId")
	req:=ResetPasswordRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}
	response,err:=h.service.ResetPassword(userId,req)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) RefreshToken(ctx *gin.Context) {
	req := RefreshTokenRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}

	if req.RefreshToken == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Refresh token is required"})
		return
	}

	response, err := h.service.RefreshToken(req.RefreshToken)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Update the refresh token cookie
    ctx.SetCookie(
        "refresh_token",
        response.RefreshToken,
        7*24*60*60,
        "/",
        "",
        true,
        true,
    )

	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) Logout(ctx *gin.Context) {

	token := ctx.GetHeader("Authorization")
	userID := ctx.GetUint("userId")
	deviceID := ctx.GetString("deviceId")
	response, err := h.service.Logout(token, userID, deviceID)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	// Clear the refresh token cookie
    ctx.SetCookie(
        "refresh_token",
        "",
        -1,    // MaxAge negative => delete cookie immediately
        "/",
        "",
        true,
        true,
    )

	ctx.JSON(http.StatusOK, response)
}

