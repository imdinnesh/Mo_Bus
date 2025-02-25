package routes

import (
	"github.com/imdinnesh/mo_bus/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func DashboardRoutes(router *gin.RouterGroup, db *gorm.DB) {

	dashboardRouter:= router.Group("/dashboard", middleware.ProtectedMiddleware())

	dashboardRouter.GET("/bookings", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "All bookings"})
	})



}