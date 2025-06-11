package transactions

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

func (h *Handler) GetBalance(ctx *gin.Context) {
	userid := ctx.GetUint("userId")
	response, err := h.service.GetBalance(userid)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) GetTransactions(ctx *gin.Context) {
	userid := ctx.GetUint("userId")
	response, err := h.service.GetTransactions(userid)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, response)
}
