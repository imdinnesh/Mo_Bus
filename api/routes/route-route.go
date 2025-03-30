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

	routeRouter.GET("/get-routes",func(ctx *gin.Context) {
        var routes []database.Route
        db.Preload("RouteStops").Preload("RouteStops.Stop").Find(&routes)

        ctx.JSON(http.StatusOK,gin.H{
            "routes":routes,
        })
    })

    routeRouter.GET("/get-route/:id",func(ctx *gin.Context) {
        id := ctx.Param("id")
        var route database.Route
        db.Preload("RouteStops").Preload("RouteStops.Stop").Where("id = ?", id).First(&route)

        if route.ID == 0 {
            ctx.JSON(http.StatusNotFound,gin.H{
                "message":"Route not found",
            })
            return
        }

        ctx.JSON(http.StatusOK,gin.H{
            "route":route,
        })
    })

	




}