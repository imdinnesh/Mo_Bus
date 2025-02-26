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

    dashboardRouter.GET("/tickets",func(ctx *gin.Context) {
        userId:=ctx.GetUint("userId")

        // get the the tickets booked by the user which are not generated

        var tickets []struct {
            Id uint `json:"id"`
            CreatedAt string `json:"created_at"`
            BookingID uint `json:"booking_id"`
        }

        db.Model(&database.Ticket{}).
        Select("created_at, booking_id","id").Where("user_id = ? AND generated_status = ?",userId,false).Find(&tickets)

        bookingIds:=make([]uint,len(tickets))

        for i,ticket:=range tickets{
            bookingIds[i]=ticket.BookingID
        }

        var bookings []struct {
            StartStopID  uint   `json:"start_stop_id"`
            EndStopID    uint   `json:"end_stop_id"`
            Amount       float64 `json:"amount"`
        }

        db.Model(&database.Booking{}).
        Select("start_stop_id, end_stop_id, amount").
        Where("id IN ?",bookingIds).
        Find(&bookings)

        ctx.JSON(200,gin.H{
            "tickets":tickets,
            "bookings":bookings,
        })




    })



    


}
