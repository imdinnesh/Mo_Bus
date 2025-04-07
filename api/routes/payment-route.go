package routes

import (
	paymentcontroller "github/imdinnes/mobusapi/controllers/paymentController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func PaymentRoutes(router *gin.RouterGroup, db *gorm.DB) {
	paymentRouter := router.Group("/payment", middleware.AuthMiddleware())

	paymentRouter.POST("/update-balance", paymentcontroller.UpdateBalance(db))

	paymentRouter.GET("/transactions", paymentcontroller.GetTransactions(db))

}
