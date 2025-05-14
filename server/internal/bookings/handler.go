package bookings

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

func (h *Handler) CreateBookings(ctx *gin.Context) {
	req:=&CreateBookingsRequest{}
	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return

	}

	userID:=ctx.GetUint("userId")
	response,err:=h.service.CreateBookings(userID,req)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, response)
}