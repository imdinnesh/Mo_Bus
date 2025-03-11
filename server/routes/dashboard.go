package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
)

func DashboardRoutes(router *gin.RouterGroup, db *gorm.DB) {

	dashboardRouter := router.Group("/dashboard", middleware.ProtectedMiddleware())

	dashboardRouter.GET("/bookings", func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")

		var bookings []struct {
			StartStopID   uint    `json:"start_stop_id"`
			StartStopName string  `json:"start_stop_name"`
			EndStopID     uint    `json:"end_stop_id"`
			EndStopName   string  `json:"end_stop_name"`
			Amount        float64 `json:"amount"`
			BookingDate   string  `json:"booking_date"`
		}

		db.Table("bookings").
			Select("bookings.start_stop_id, start_stops.stop_name as start_stop_name, bookings.end_stop_id, end_stops.stop_name as end_stop_name, bookings.amount, bookings.booking_date").
			Joins("JOIN stops as start_stops ON bookings.start_stop_id = start_stops.id").
			Joins("JOIN stops as end_stops ON bookings.end_stop_id = end_stops.id").
			Where("bookings.user_id = ?", userId).
			Find(&bookings)

		ctx.JSON(200, gin.H{
			"bookings": bookings,
		})

	})

	dashboardRouter.GET("/tickets", func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")

		// get the the tickets booked by the user which are not generated

		var tickets []struct {
			Id            uint   `json:"id"`
			CreatedAt     string `json:"created_at"`
			BookingID     uint   `json:"booking_id"`
			StartStopName string `json:"start_stop_name"`
			EndStopName   string `json:"end_stop_name"`
		}

		db.Table("tickets").
			Select("tickets.id, tickets.created_at, tickets.booking_id, start_stops.stop_name as start_stop_name, end_stops.stop_name as end_stop_name").
			Joins("JOIN bookings ON tickets.booking_id = bookings.id").
			Joins("JOIN stops as start_stops ON bookings.start_stop_id = start_stops.id").
			Joins("JOIN stops as end_stops ON bookings.end_stop_id = end_stops.id").
			Where("tickets.user_id = ? AND tickets.generated_status = ?", userId, false).
			Find(&tickets)

		ctx.JSON(200, gin.H{
			"tickets": tickets,
		})

	})

}
