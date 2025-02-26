package routes

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
)

func BookingRoutes(router *gin.RouterGroup, db *gorm.DB) {
	bookingRouter := router.Group("/bookings", middleware.ProtectedMiddleware())

	bookingRouter.POST("/", func(ctx *gin.Context) {
		email := ctx.GetString("email")

		var request struct {
			StartStopID uint `json:"start_stop_id"`
			EndStopID   uint `json:"end_stop_id"`
		}

		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		var user database.User
		db.Where("email = ?", email).First(&user)
		userID := user.ID

		availableBalance := user.Balance

		if availableBalance < 10 {
			ctx.JSON(400, gin.H{"error": "Insufficient balance"})
			return
		}

		// Create booking
		booking := database.Booking{
			UserID:      userID,
			StartStopID: request.StartStopID,
			EndStopID:   request.EndStopID,
			Amount:      10,
			Status:      "success",
			BookingDate: time.Now(),
		}

		db.Create(&booking)

		// Create payment
		payment := database.Payment{
			UserID:          userID,
			BookingID:       booking.ID,
			Amount:          10,
			Status:          "success",
			TransactionDate: time.Now(),
		}

		db.Create(&payment)

		// also create a ticket for the user

		// Create ticket

		ticket := database.Ticket{
			UserID:           userID,
			BookingID:        booking.ID,
			GeneratedStatus: false,
		}

		db.Create(&ticket)

		// Update user balance
		user.Balance = availableBalance - 10
		db.Save(&user)

		ctx.JSON(200, gin.H{
			"message": "Booking created successfully",
		})
	})
}
