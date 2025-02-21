package routes

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/middleware"
	"github.com/imdinnesh/mo_bus/utils"
)

func QRCodeRoutes(router *gin.RouterGroup) {
	qrRouter := router.Group("/qrcode", middleware.ProtectedMiddleware())

	qrRouter.GET("/generate", func(ctx *gin.Context) {
		email := ctx.GetString("email")
		expiryTime := time.Now().Add(30 * time.Minute).Unix() // 30 minutes expiry time
		data := fmt.Sprintf("ticket:%s:%d", email, expiryTime)
		qrCode, err := utils.GenerateQRCode(data)
		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to generate QR code"})
			return
		}

		ctx.JSON(200, gin.H{
			"message": "QR code generated",
			"qr_code": "data:image/png;base64," + qrCode,
		})
	})

	qrRouter.POST("/verify", func(ctx *gin.Context) {
		var request struct {
			QRCode string `json:"qr_code"`
		}

		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// Verify the QR code
		valid, err := utils.VerifyQRCode(request.QRCode)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid ticket format"})
			return
		}

		if !valid {
			ctx.JSON(400, gin.H{"error": "Ticket has expired"})
			return
		}

		ctx.JSON(200, gin.H{
			"message":"Ticket verified",
		})
	})
}
