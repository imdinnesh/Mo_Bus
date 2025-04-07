package routes

import (
	profilecontroller "github/imdinnes/mobusapi/controllers/profileController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ProfileRoutes(router *gin.RouterGroup, db *gorm.DB) {
	profileRouter := router.Group("/profile", middleware.AuthMiddleware())

	profileRouter.GET("/",profilecontroller.GetData(db))

	profileRouter.PUT("/update",profilecontroller.UpdateData(db))
}
