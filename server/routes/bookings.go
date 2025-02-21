package routes

// route for handling bookings

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
)

func BookingRoutes(router *gin.RouterGroup, db *gorm.DB) {
	bookingRouter := router.Group("/bookings", middleware.ProtectedMiddleware())

	bookingRouter.POST("/", func(ctx *gin.Context) {

	})

}
