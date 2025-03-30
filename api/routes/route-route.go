package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RouteRoutes(router *gin.RouterGroup, db *gorm.DB) {
	routeRouter := router.Group("/route",middleware.AuthMiddleware(),middleware.AdminMiddleware())

	routeRouter.POST("/add-route",func(ctx *gin.Context) {
		var route database.Route
		ctx.BindJSON(&route)

		if(route.RouteNumber=="" || route.RouteName=="" || route.Direction==0){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Route number or name or direction is empty",
			})
			return
		}
		// check if route already exists
		result := db.Where("route_number = ?", route.RouteNumber).Where("direction = ?", route.Direction).First(&route)
		if result.RowsAffected > 0 {
			ctx.JSON(http.StatusConflict,gin.H{
				"message":"Route already exists",
			})
			return
		}
		// create route
		db.Create(&route)
		ctx.JSON(http.StatusCreated,gin.H{
			"message":"Route created",
		})
	})



}