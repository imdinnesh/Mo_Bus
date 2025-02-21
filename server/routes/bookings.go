package routes

// route for handling bookings

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
	"github.com/imdinnesh/mo_bus/database"
)

func BookingRoutes(router *gin.RouterGroup, db *gorm.DB) {
	bookingRouter := router.Group("/bookings", middleware.ProtectedMiddleware())

	bookingRouter.POST("/", func(ctx *gin.Context) {
		// bookings need userid, start stop id, end stop id
		// get the user id from the token
		// get the start stop id and end stop id from the request body
		// create a booking
		// deduct the amount from the user's balance
		// return the booking
		email:= ctx.GetString("email")

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

		var booking database.Booking
		booking.UserID = userID
		booking.StartStopID = request.StartStopID
		booking.EndStopID = request.EndStopID
		booking.Amount = 10

		db.Create(&booking)
		// do i have to update the payments table here?

		

		user.Balance = availableBalance - 10
		db.Save(&user)

		ctx.JSON(200,gin.H{
			"message": "Booking created successfully",
		})

	})

}
