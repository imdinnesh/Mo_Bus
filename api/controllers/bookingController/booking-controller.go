package bookingcontroller

import (
	"github/imdinnes/mobusapi/database"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const BookingAmount = 10

func CreateBooking(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var bookingRequest struct {
			RouteID           uint `json:"route_id"`
			SourceStopID      uint `json:"source_stop_id"`
			DestinationStopID uint `json:"destination_stop_id"`
		}

		if err := ctx.ShouldBindJSON(&bookingRequest); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		userID := ctx.GetUint("userId")

		
		var bookingID uint
		err := db.Transaction(func(tx *gorm.DB) error {
			// Create booking
			booking := database.Booking{
				UserID:            userID,
				RouteID:           bookingRequest.RouteID,
				SourceStopID:      bookingRequest.SourceStopID,
				DestinationStopID: bookingRequest.DestinationStopID,
				BookingDate:       time.Now(),
				Amount:            BookingAmount,
			}
			if err := tx.Create(&booking).Error; err != nil {
				return err
			}
			bookingID = booking.ID

			// Record transaction
			transaction := database.Transaction{
				UserID:    userID,
				Amount:    BookingAmount,
				Status:    "success",
				Type:      "debit",
				CreatedAt: time.Now(),
			}
			if err := tx.Create(&transaction).Error; err != nil {
				return err
			}

			// Deduct balance
			var user database.User
			if err := tx.First(&user, userID).Error; err != nil {
				return err
			}
			user.Balance -= BookingAmount
			if err := tx.Save(&user).Error; err != nil {
				return err
			}

			return nil
		})

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to complete booking process", "details": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"message":    "Booking created successfully",
			"booking_id": bookingID,
		})
		

	}
}

func GetBookings(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userID := ctx.GetUint("userId")

		type BookingResponse struct {
			ID                  uint      `json:"id"`
			RouteNumber         string    `json:"route_number"`
			RouteName           string    `json:"route_name"`
			SourceStopName      string    `json:"source_stop_name"`
			DestinationStopName string    `json:"destination_stop_name"`
			BookingDate         time.Time `json:"booking_date"`
			Amount              float64   `json:"amount"`
		}

		bookings := []database.Booking{}
		err := db.Preload("SourceStop").
			Preload("DestinationStop").
			Preload("Route").
			Where("user_id = ?", userID).
			Find(&bookings).Error

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookings"})
			return
		}

		var response []BookingResponse
		for _, booking := range bookings {
			response = append(response, BookingResponse{
				ID:                  booking.ID,
				RouteNumber:         booking.Route.RouteNumber,
				RouteName:           booking.Route.RouteName,
				SourceStopName:      booking.SourceStop.StopName,
				DestinationStopName: booking.DestinationStop.StopName,
				BookingDate:         booking.BookingDate,
				Amount:              booking.Amount,
			})
		}

		ctx.JSON(http.StatusOK, response)

	}
}

func GetBooking(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")
		bookingId := ctx.Param("id")

		type BookingResponse struct {
			ID                  uint      `json:"id"`
			RouteNumber         string    `json:"route_number"`
			RouteName           string    `json:"route_name"`
			SourceStopName      string    `json:"source_stop_name"`
			DestinationStopName string    `json:"destination_stop_name"`
			BookingDate         time.Time `json:"booking_date"`
			Amount              float64   `json:"amount"`
		}

		booking := database.Booking{}
		err := db.Preload("SourceStop").
			Preload("DestinationStop").
			Preload("Route").
			Where("user_id = ?", userId).
			Where("id = ?", bookingId).
			First(&booking).Error

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch booking"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"message": "Booking fetched successfully",
			"booking": BookingResponse{
				ID:                  booking.ID,
				RouteNumber:         booking.Route.RouteNumber,
				RouteName:           booking.Route.RouteName,
				SourceStopName:      booking.SourceStop.StopName,
				DestinationStopName: booking.DestinationStop.StopName,
				BookingDate:         booking.BookingDate,
				Amount:              booking.Amount,
			},
		})
	}
}
