package routecontroller

import (
	"github/imdinnes/mobusapi/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddRoute(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var route database.Route
		ctx.BindJSON(&route)

		if route.RouteNumber == "" || route.RouteName == "" || route.Direction == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Route number or name or direction is empty",
			})
			return
		}
		// check if route already exists
		result := db.Where("route_number = ?", route.RouteNumber).Where("direction = ?", route.Direction).First(&route)
		if result.RowsAffected > 0 {
			ctx.JSON(http.StatusConflict, gin.H{
				"message": "Route already exists",
			})
			return
		}
		// create route
		db.Create(&route)
		ctx.JSON(http.StatusCreated, gin.H{
			"message": "Route created",
		})
	}
}

func GetRoutes(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var routes []database.Route
		db.Preload("RouteStops").Preload("RouteStops.Stop").Find(&routes)

		ctx.JSON(http.StatusOK, gin.H{
			"routes": routes,
		})
	}
}

func GetRouteById(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		var route database.Route
		db.Preload("RouteStops").Preload("RouteStops.Stop").Where("id = ?", id).First(&route)

		if route.ID == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "Route not found",
			})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{
			"route": route,
		})
	}
}

func UpdateRoute(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		var route database.Route

		// Find the route by ID with error handling
		if err := db.Where("id = ?", id).First(&route).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "Route not found"})
			return
		}

		var updateData database.Route
		if err := ctx.ShouldBindJSON(&updateData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid JSON input"})
			return
		}

		// Validate at least one updatable field is provided
		if updateData.RouteNumber == "" && updateData.RouteName == "" && updateData.Direction == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "At least one of RouteNumber, RouteName, or Direction is required"})
			return
		}

		// Update only the non-zero fields
		updateFields := map[string]interface{}{}
		if updateData.RouteNumber != "" {
			updateFields["route_number"] = updateData.RouteNumber
		}
		if updateData.RouteName != "" {
			updateFields["route_name"] = updateData.RouteName
		}
		if updateData.Direction != 0 {
			updateFields["direction"] = updateData.Direction
		}

		// Apply updates
		db.Model(&route).Updates(updateFields)

		ctx.JSON(http.StatusOK, gin.H{"message": "Route updated successfully"})
	}
}

func DeleteRoute(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		var route database.Route

		// Find the route by ID with error handling
		if err := db.Where("id = ?", id).First(&route).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "Route not found"})
			return
		}

		// Delete the route
		db.Delete(&route)

		ctx.JSON(http.StatusOK, gin.H{"message": "Route deleted successfully"})
	}
}
