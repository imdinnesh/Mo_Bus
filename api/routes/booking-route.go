package routes

import (
	bookingcontroller "github/imdinnes/mobusapi/controllers/bookingController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const BookingAmount = 10

func BookingRoutes(router *gin.RouterGroup, db *gorm.DB) {
	bookingRouter := router.Group("/booking", middleware.AuthMiddleware())

	bookingRouter.POST("/create-booking", bookingcontroller.CreateBooking(db))

	bookingRouter.GET("/get-bookings", bookingcontroller.GetBookings(db))

	bookingRouter.GET("/get-booking/:id", bookingcontroller.GetBooking(db))
}
