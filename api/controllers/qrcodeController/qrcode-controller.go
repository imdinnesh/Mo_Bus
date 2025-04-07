package qrcodecontroller

import(
	"fmt"
	"github.com/gin-gonic/gin"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/utils/QrCode"
	"gorm.io/gorm"
	"net/http"
	"strings"
	"time"
)

func StartTrip(db *gorm.DB) gin.HandlerFunc{
	return func(ctx *gin.Context) {
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

		sessionKey, err := qrcode.CreateSession(userId, request.BookingID, request.RouteID, request.Source, request.Destination)
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

		// create qr code entry
		qrCode := &database.QrCode{
			UserID:    userId,
			BookingID: request.BookingID,
			Used:      false,
		}
		if err := db.Create(qrCode).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to create QR code",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"message":     "Trip started successfully",
			"session_key": sessionKey,
		})
	}
}

func GenerateQRCode(db *gorm.DB) gin.HandlerFunc{
	return func(ctx *gin.Context) {
		userID := ctx.GetUint("userId")
		userIDStr := fmt.Sprintf("%d", userID)
		sessionkey := ctx.Query("session_key")
		// session key is in the format "trip:userId:BookingId"
		bookingID := strings.Split(sessionkey, ":")[2]
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

		qrCode, err := qrcode.GenerateQRCode(userIDStr, routeID, source, destination, bookingID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to generate QR code",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"qr_code": qrCode})
	}
}

func VerifyQRCode(db *gorm.DB) gin.HandlerFunc{
	return func(ctx *gin.Context) {
		type VerifyRequest struct {
			UserID      string `json:"user_id"`          // From scanned QR
			RouteID     string `json:"route_id"`         // From validator input
			Source      string `json:"source_stop"`      // From validator input
			Destination string `json:"destination_stop"` // From validator input
			OTP         string `json:"otp"`              // From scanned QR
			BookingID   string `json:"booking_id"`       // From scanned QR
		}
	
		var request VerifyRequest
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request payload",
			})
			return
		}
	
		// Step 1: Verify QR authenticity and validity
		if err := qrcode.VerifyQRCode(request.UserID, request.RouteID, request.Source, request.Destination, request.OTP); err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		// Step 3: Lookup and update QR code usage status in DB
		var qrCode database.QrCode
		if err := db.Where("booking_id = ?",request.BookingID).First(&qrCode).Error; err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid or unknown booking ID",
			})
			return
		}
	
		if qrCode.Used {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "QR code has already been used",
			})
			return
		}
	
		// Step 4: Mark as used
		qrCode.Used = true
		qrCode.UsedAt = time.Now()
	
		if err := db.Save(&qrCode).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to update QR code status",
			})
			return
		}
	
		ctx.JSON(http.StatusOK, gin.H{
			"message": "QR code successfully verified and marked as used",
		})
	}
}

