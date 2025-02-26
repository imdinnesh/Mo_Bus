package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
)

func DashboardRoutes(router *gin.RouterGroup, db *gorm.DB) {

	dashboardRouter := router.Group("/dashboard", middleware.ProtectedMiddleware())

	dashboardRouter.GET("/bookings", func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")

		// db.Preload("User").Preload("StartStop").Preload("EndStop").Where("user_id = ?", userId).Find(&bookings)

		var bookings []struct {
            StartStopID  uint   `json:"start_stop_id"`
            EndStopID    uint   `json:"end_stop_id"`
            Amount       float64 `json:"amount"`
            BookingDate  string `json:"booking_date"`
        }

        db.Model(&database.Booking{}).
            Select("start_stop_id, end_stop_id, amount, booking_date").
            Where("user_id = ?", userId).
            Find(&bookings)

        ctx.JSON(200, gin.H{
            "bookings": bookings,
        })

	})

}
