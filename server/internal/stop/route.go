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

	stops := r.Group("/stop",middleware.AuthMiddleware())
	stops.POST("/add-stop",middleware.AdminMiddleware(),handler.AddStop)
	stops.PUT("/update-stop/:id",middleware.AdminMiddleware(),handler.UpdateStop)
	stops.DELETE("/delete-stop/:id",middleware.AdminMiddleware(),handler.DeleteStop)
	stops.GET("/get-stops", handler.GetStops)
}
