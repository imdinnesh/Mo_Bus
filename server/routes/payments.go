package routes

import (
    "github.com/gin-gonic/gin"
    "github.com/imdinnesh/mo_bus/database"
    "github.com/imdinnesh/mo_bus/middleware"
    "gorm.io/gorm"
)

func PaymentRoutes(router *gin.RouterGroup, db *gorm.DB) {
    paymentRouter := router.Group("/payment", middleware.ProtectedMiddleware())

    paymentRouter.GET("/balance", func(ctx *gin.Context) {
        email := ctx.GetString("email")
        var user database.User
        db.Where("email = ?", email).First(&user)

        ctx.JSON(200, gin.H{
            "message": "Balance accessed",
            "balance": user.Balance,
        })
    })

    paymentRouter.POST("/add", func(ctx *gin.Context) {
        email := ctx.GetString("email")
        
        var request struct {
            Amount float64 `json:"amount"`
        }
        if err := ctx.BindJSON(&request); err != nil {
            ctx.JSON(400, gin.H{"error": "Invalid request"})
            return
        }

        var userDB database.User
        if err := db.Where("email = ?", email).First(&userDB).Error; err != nil {
            ctx.JSON(400, gin.H{"error": "User not found"})
            return
        }

        // use increment to add the balance
        db.Model(&userDB).Update("balance", userDB.Balance + request.Amount)

        ctx.JSON(200, gin.H{
            "message": "Balance added",
        })
    })
}