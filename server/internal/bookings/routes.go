package bookings

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	bookings := r.Group("/booking")
	bookings.Use(middleware.AuthMiddleware())
	bookings.POST("/create-booking",handler.CreateBookings)
}

