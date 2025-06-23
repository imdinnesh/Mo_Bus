package routestop

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	routeStops:=r.Group("/route-stop", middleware.AuthMiddleware(), middleware.AdminMiddleware())
	routeStops.POST("/add-route-stop", handler.AddRouteStop)
	routeStops.PUT("/update-route-stop/:id", handler.UpdateRouteStop)
	routeStops.DELETE("/delete-route-stop/:id", handler.DeleteRouteStop)
	routeStops.GET("/view-route-stops/:route_id", handler.GetRouteStops)
}
