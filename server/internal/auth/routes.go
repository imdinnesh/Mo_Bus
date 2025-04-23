package auth
import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	service := NewService(db)
	handler := NewHandler(service)
	auth:= r.Group("/auth")
	auth.GET("/google/login", handler.GoogleLogin)
	auth.GET("/google/callback", handler.GoogleCallback)
}