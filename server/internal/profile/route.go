package profile

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	profile := r.Group("/profile",middleware.AuthMiddleware())
	profile.GET("/",handler.GetProfile)
	// may change the route to add a otp verification to update the email
	profile.PUT("/update",handler.UpdateProfile)
}
