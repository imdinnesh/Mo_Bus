package routes

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"github/imdinnes/mobusapi/utils/QrCode"
	"gorm.io/gorm"
	"net/http"
)

func QrCodeRoutes(router *gin.RouterGroup, db *gorm.DB) {
	qrCodeRouter := router.Group("/qrcode", middleware.AuthMiddleware())

	qrCodeRouter.POST("/start-trip", func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")
		type StartTripRequest struct {
			BookingID   uint `json:"booking_id"`
			RouteID     uint `json:"route_id"`
			Source      uint `json:"source"`
			Destination uint `json:"destination"`
		}

		request := StartTripRequest{}
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}

		if request.BookingID == 0 || request.RouteID == 0 || request.Source == 0 || request.Destination == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}
		booking := &database.Booking{}
		if err := db.First(booking, request.BookingID).Error; err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid booking ID",
			})
			return
		}

		if booking.UserID != userId {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid booking ID",
			})
			return
		}
		// check if the booking is already started
		if booking.IsGenerated {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Trip already started",
			})
			return
		}

		sessionKey, err := qrcode.CreateSession(userId,request.BookingID, request.RouteID, request.Source, request.Destination)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create session",
			})
			return
		}

		// update the booking status
		booking.IsGenerated = true
		if err := db.Save(&booking).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to start trip",
			})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"message":     "Trip started successfully",
			"session_key": sessionKey,
		})
	})

	qrCodeRouter.GET("/generate", func(ctx *gin.Context) {
		userID := ctx.GetUint("userId")
		userIDStr := fmt.Sprintf("%d", userID)
		sessionkey := ctx.Query("session_key")
		if sessionkey == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Session key is required",
			})
			return
		}

		// Validate session key
		routeID, source, destination, err := qrcode.ValidatesSession(sessionkey)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid session key",
			})
			return
		}

		qrCode, err := qrcode.GenerateQRCode(userIDStr, routeID, source, destination)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to generate QR code",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"qr_code": qrCode})
	})

}
