package routes

// this route is used to search for routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/middleware"
	"gorm.io/gorm"
)

// SearchRoutes is used to define the search routes

func SearchRoutes(router *gin.RouterGroup, db *gorm.DB) {
	searchRouter := router.Group("/search",middleware.ProtectedMiddleware())


	searchRouter.POST("/", func(ctx *gin.Context) {
		// user can give source and destination stops or route number
		// if source and destination stops are given, return the routes that connect the two stops
		// if route number is given, return the stops in the route

		var request struct {
			SourceStopID      uint   `json:"source_stop_id"`
			DestinationStopID uint   `json:"destination_stop_id"`
			RouteNumber       string `json:"route_number"`
		}

		if err := ctx.BindJSON(&request); err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid request"})
			return
		}
		
		if request.RouteNumber != "" {
			// return the stops in the route
			var routeStops []struct {
				StopID   uint   `json:"stop_id"`
				StopName string `json:"stop_name"`
			}

			// use gorm to get the stops in the route
			db.Select("stop_id, stop_name").Table("route_stops").Joins("JOIN stops ON stops.id = route_stops.stop_id").Joins("JOIN routes ON routes.id = route_stops.route_id").Where("route_number = ?", request.RouteNumber).Scan(&routeStops)
			
			ctx.JSON(200, gin.H{
				"message": "Route stops accessed",
				"route_stops": routeStops,
			})


		}else{
			// return the routes that connect the two stops

			var routes []struct {
				RouteNumber string `json:"route_number"`
				RouteName   string `json:"route_name"`
			}

			// use gorm to get the routes that connect the two stops
			db.Select("route_number, route_name").Table("routes").Joins("JOIN route_stops AS rs1 ON rs1.route_id = routes.id").Joins("JOIN route_stops AS rs2 ON rs2.route_id = routes.id").Where("rs1.stop_id = ? AND rs2.stop_id = ?", request.SourceStopID, request.DestinationStopID).Scan(&routes)
			if routes == nil {
				ctx.JSON(400, gin.H{"error": "No routes found"})
				return
			}

			ctx.JSON(200, gin.H{
				"message": "Routes accessed",
				"routes": routes,
			})	

		}






	})

	searchRouter.POST("/stops", func(ctx *gin.Context) {
		// search for stops by name or stop number
		// return the stops that match the search query

		// user can give stop name or stop number

		var request struct {
			Query    string `json:"query"`
		}

		err:=ctx.BindJSON(&request)
		if err!=nil{
			ctx.JSON(400,gin.H{"error":"Invalid request"})
			return
		}
		
		



	})
}