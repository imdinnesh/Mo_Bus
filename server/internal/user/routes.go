package user

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	users := r.Group("/user")
    users.POST("/signup",handler.CreateUser)  
	users.POST("/verify-email",handler.VerifyUser)
	users.POST("/resend-otp",handler.ResendOTP)
	users.POST("/signin",handler.SignIn)
	users.GET("/profile",middleware.AuthMiddleware(),handler.GetProfile)
	users.PATCH("/reset-password",middleware.AuthMiddleware(),handler.ResetPassword)
}
