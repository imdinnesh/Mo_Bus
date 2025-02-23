package routes

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/middleware"
	"github.com/imdinnesh/mo_bus/utils"
	"gorm.io/gorm"
)

func QRCodeRoutes(router *gin.RouterGroup, db *gorm.DB) {
	qrRouter := router.Group("/qrcode", middleware.ProtectedMiddleware())

	qrRouter.GET("/generate", func(ctx *gin.Context) {

		var request struct {
			TicketID  uint  `json:"ticket_id"` 
		}

		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(400, gin.H{"error": err.Error()})
			return
		}

		// also check if the ticket is already generated

		var ticketCheck database.Ticket

		db.Where("id = ?", request.TicketID).First(&ticketCheck)

		if ticketCheck.Generated_Status {
			ctx.JSON(400, gin.H{"error": "Ticket already generated"})
			return
		}




		email := ctx.GetString("email")

		var user database.User

		db.Where("email = ?", email).First(&user)

		expiryTime := time.Now().Add(30 * time.Minute) // 30 minutes expiry time

		// add the ticket id to the data
		data := fmt.Sprintf("%s:%d:%d", user.Email, request.TicketID, expiryTime.Unix())
		


		qrCode, err := utils.GenerateQRCode(data)
		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to generate QR code"})
			return
		}

		// Create Qr code entry

		qrCodeEntry := database.QRCode{
			UserID: user.ID,
			TicketID: request.TicketID,
			QRCode: qrCode, // prefix is not added here
			ExpiryTime: expiryTime,
			Verified_Status: false,

		}

		db.Create(&qrCodeEntry)

		// now update the ticket status in Ticket table

		var ticket database.Ticket

		db.Where("id = ?", request.TicketID).First(&ticket)

		ticket.Generated_Status = true

		db.Save(&ticket)



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
		ticketid,valid,err := utils.VerifyQRCode(request.QRCode)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid ticket format"})
			return
		}

		if ticketid==0{
			ctx.JSON(400, gin.H{"error": "Ticket has expired"})
			return
		}

		if !valid {
			ctx.JSON(400, gin.H{"error": "Ticket has expired"})
			return
		}

		// Update the QR code status

		qrcode:=database.QRCode{}

		db.Where("ticket_id = ?", ticketid).First(&qrcode)

		qrcode.Verified_Status=true

		db.Save(&qrcode)

		ctx.JSON(200, gin.H{
			"message":"Ticket verified",
		})
	})
}
