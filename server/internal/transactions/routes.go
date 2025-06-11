package transactions

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	transactions:=r.Group("/transactions")
	transactions.GET("/get-balance",middleware.AuthMiddleware(), handler.GetBalance)
	transactions.GET("/get-transactions", middleware.AuthMiddleware(), handler.GetTransactions)
}