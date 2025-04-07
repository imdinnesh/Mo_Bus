package routes

import (
	admincontroller "github/imdinnes/mobusapi/controllers/adminController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AdminRoutes(router *gin.RouterGroup, db *gorm.DB) {
	AdminRouter := router.Group("/admin")

	AdminRouter.POST("/signup", admincontroller.SignUp(db))

	AdminRouter.POST("/signin", admincontroller.SignIn(db))

	AdminRouter.POST("/refresh-token", admincontroller.RefreshToken(db))

	AdminRouter.PATCH("/reset-password", middleware.AuthMiddleware(), middleware.AdminMiddleware(), admincontroller.ResetPassword(db))

	AdminRouter.POST("/logout", middleware.AuthMiddleware(), middleware.AdminMiddleware(), admincontroller.Logout(db))

	AdminRouter.GET("/profile", middleware.AuthMiddleware(), middleware.AdminMiddleware(), admincontroller.Profile(db))

}
