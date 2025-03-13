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
	
		// Define a struct for the simplified response
		type TicketResponse struct {
			TicketID   uint   `json:"ticket_id"`
			StartStop  string `json:"start_stop"`
			EndStop    string `json:"end_stop"`
		}
	
		// Query the database
		var tickets []database.Ticket
		db.Preload("Booking.StartStop").Preload("Booking.EndStop").
			Where("user_id = ? AND generated_status = ?", userId, false).Find(&tickets)
	
		// Map the results to the simplified response struct
		var response []TicketResponse
		for _, ticket := range tickets {
			response = append(response, TicketResponse{
				TicketID:   ticket.ID,
				StartStop:  ticket.Booking.StartStop.StopName,
				EndStop:    ticket.Booking.EndStop.StopName,
			})
		}
	
		// Return the simplified response
		ctx.JSON(200, gin.H{
			"tickets": response,
		})
	})

}
