package routes

import (
	"github/imdinnes/mobusapi/middleware"
	 "github/imdinnes/mobusapi/utils/QrCode"
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func QrCodeRoutes(router *gin.RouterGroup, db *gorm.DB) {
	qrCodeRouter := router.Group("/qrcode", middleware.AuthMiddleware())

	qrCodeRouter.GET("/generate", func(ctx *gin.Context) {
		userID := ctx.GetUint("userId") // must be set by auth middleware
		routeID := ctx.Query("route_id")
		source := ctx.Query("source")
		destination := ctx.Query("destination")
	
		if routeID == "" || source == "" || destination == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Missing required query parameters",
			})
			return
		}
	
		userIDStr := fmt.Sprintf("%d", userID)
	
		qrCode, err := qrcode.GenerateQRCode(userIDStr, routeID, source, destination)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error": "Failed to generate QR code",
			})
			return
		}
	
		ctx.JSON(http.StatusOK, gin.H{"qr_code": qrCode})
	})
	
	// qrCodeRouter.GET("/get-qr-codes", qrcodecontroller.GetQRCodes(db))
	// qrCodeRouter.GET("/get-qr-code/:id", qrcodecontroller.GetQRCode(db))
}

