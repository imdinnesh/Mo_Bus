package routes

import (
	stopcontroller "github/imdinnes/mobusapi/controllers/stopController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func StopRoutes(router *gin.RouterGroup, db *gorm.DB) {
	stopRouter := router.Group("/stop", middleware.AuthMiddleware(), middleware.AdminMiddleware())

	stopRouter.POST("/add-stop", stopcontroller.AddStop(db))

	stopRouter.PUT("/update-stop/:id", stopcontroller.UpdateStop(db))

	stopRouter.DELETE("/delete-stop/:id", stopcontroller.DeleteStop(db))
}
