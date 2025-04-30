package payment

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

func (h *Handler) UpdateBalance(ctx *gin.Context) {
	userId:=ctx.GetUint("userId")
	req:=&UpdateBalanceRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request"})
		return
	}
	response,err:=h.service.UpdateBalance(req,userId)
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

