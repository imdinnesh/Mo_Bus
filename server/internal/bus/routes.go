package bus

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/middlewares"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup, db *gorm.DB) {
	repo := NewRepository(db)
	service := NewService(repo)
	handler := NewHandler(service)

	busroutes:=r.Group("/bus-route")
	busroutes.POST("/add-bus",middleware.AuthMiddleware(),middleware.AdminMiddleware(),handler.AddBusToRoute)
	busroutes.GET("/get-bus", middleware.AuthMiddleware(), handler.GetBusesByRouteId)
}
