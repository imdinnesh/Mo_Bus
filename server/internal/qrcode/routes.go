package qrcode

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	qrcode := r.Group("/qrcode",middleware.AuthMiddleware())
	qrcode.POST("/start-trip", handler.StartTrip)
	qrcode.GET("/generate", handler.GenerateQRCode)
	qrcode.POST("/validate", handler.VerifyQRCode)
}
