package admin

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	admins := r.Group("/admin")
    admins.POST("/signup",handler.CreateUser)  
	admins.POST("/signin",handler.SignIn)
	admins.GET("/profile",middleware.AuthMiddleware(),middleware.AdminMiddleware(),handler.GetProfile)
	admins.PATCH("/reset-password",middleware.AuthMiddleware(),middleware.AdminMiddleware(),handler.ResetPassword)
	admins.POST("/refresh-token",handler.RefreshToken)
	admins.POST("/logout",middleware.AuthMiddleware(),middleware.AdminMiddleware(),handler.Logout)
}
