package routes

import (
	routecontroller "github/imdinnes/mobusapi/controllers/routeController"
	"github/imdinnes/mobusapi/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RouteRoutes(router *gin.RouterGroup, db *gorm.DB) {
	routeRouter := router.Group("/route", middleware.AuthMiddleware(), middleware.AdminMiddleware())

	routeRouter.POST("/add-route", routecontroller.AddRoute(db))

	routeRouter.GET("/get-routes", routecontroller.GetRoutes(db))

	routeRouter.GET("/get-route/:id", routecontroller.GetRouteById(db))

	routeRouter.PUT("/update-route/:id", routecontroller.UpdateRoute(db))

	routeRouter.DELETE("/delete-route/:id", routecontroller.DeleteRoute(db))
}
