package routes

import (
	qrcodecontroller "github/imdinnes/mobusapi/controllers/qrcodeController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func QrCodeRoutes(router *gin.RouterGroup, db *gorm.DB) {
	qrCodeRouter := router.Group("/qrcode", middleware.AuthMiddleware())

	qrCodeRouter.POST("/start-trip",qrcodecontroller.StartTrip(db))

	qrCodeRouter.GET("/generate",qrcodecontroller.GenerateQRCode(db))

	qrCodeRouter.POST("/validate", qrcodecontroller.VerifyQRCode(db))
	
}
