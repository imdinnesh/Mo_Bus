package announcements

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	announcements := r.Group("/booking")
	announcements.Use(middleware.AuthMiddleware())
	announcements.POST("/create-announcement",middleware.AdminMiddleware(),handler.CreateAnnouncement)
	announcements.GET("/get-announcements",handler.GetAnnouncements)
}

