package routes

import (
	routestopcontroller "github/imdinnes/mobusapi/controllers/routeStopController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RouteStops(router *gin.RouterGroup, db *gorm.DB) {
	routeStopRouter := router.Group("/route-stop", middleware.AuthMiddleware(), middleware.AdminMiddleware())

	routeStopRouter.POST("add-route-stop", routestopcontroller.AddRouteStop(db))

	routeStopRouter.PUT("/update-route-stop/:id", routestopcontroller.UpdateRouteStop(db))

	routeStopRouter.DELETE("/delete-route-stop/:id", routestopcontroller.DeleteRouteStop(db))
}
