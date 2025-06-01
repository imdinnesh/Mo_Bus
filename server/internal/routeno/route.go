package routeno

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	routes:= r.Group("/route",middleware.AuthMiddleware())
	routes.GET("/get-routes",handler.GetRoutes)
	routes.GET("/get-route/:id",handler.GetRouteById)
	routes.POST("/add-route",middleware.AdminMiddleware(),handler.AddRoute)
	routes.PUT("/update-route/:id",middleware.AdminMiddleware(),handler.UpdateRoute)
	routes.DELETE("/delete-route/:id",middleware.AdminMiddleware(),handler.DeleteRoute)
	
}
