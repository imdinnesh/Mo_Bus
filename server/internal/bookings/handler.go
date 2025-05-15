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

func (h *Handler) GetBookings(ctx *gin.Context) {
	userID := ctx.GetUint("userId")
	bookings, err := h.service.GetBookings(userID)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, bookings)
}

func (h *Handler) GetBooking(ctx *gin.Context) {
	userId := ctx.GetUint("userId")
	bookingId := ctx.Param("id")
	booking, err := h.service.GetBooking(bookingId, userId)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, booking)
}

func (h *Handler) GetBookingByQuery(ctx *gin.Context) {
	userId := ctx.GetUint("userId")
	bookingId:=ctx.Query("id")
	booking, err := h.service.GetBooking(bookingId, userId)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, booking)
}


