package trip

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	tripRoute:=r.Group("/trip")
	tripRoute.POST("/get-routes", handler.GetRoutesByStops)
}
