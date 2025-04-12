package user

import (
	"github.com/gin-gonic/gin"
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
}
