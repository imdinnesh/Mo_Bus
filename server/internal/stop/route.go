package stop

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	stops := r.Group("/stop",middleware.AuthMiddleware(),middleware.AdminMiddleware())
	stops.POST("/add-stop",handler.AddStop)
	stops.PUT("/update-stop/:id",handler.UpdateStop)
	stops.DELETE("/delete-stop/:id",handler.DeleteStop)
}
