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
