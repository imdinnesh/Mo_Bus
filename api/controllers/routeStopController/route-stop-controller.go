package routestopcontroller

import (
	"github/imdinnes/mobusapi/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddRouteStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		routeStop := database.RouteStop{}
		ctx.BindJSON(&routeStop)
		if routeStop.RouteID == 0 || routeStop.StopID == 0 || routeStop.StopIndex == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Route ID, Stop ID and Stop Index are required"})
			return
		}

		// check for valid route id
		route := database.Route{}
		err := db.Where("id=?", routeStop.RouteID).First(&route).Error
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Route ID"})
			return
		}
		// check for valid stop id
		stop := database.Stop{}
		err = db.Where("id=?", routeStop.StopID).First(&stop).Error
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Stop ID"})
			return
		}
		err = db.Create(&routeStop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add route stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Route stop added successfully"})
	}
}

func UpdateRouteStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		routeStop := database.RouteStop{}
		ctx.BindJSON(&routeStop)
		// here we can change the index only
		if routeStop.StopIndex == 0 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stop Index is required"})
			return
		}

		dbRouteStop := database.RouteStop{}
		err := db.Where("id=?", id).First(&dbRouteStop).Error
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Route Stop ID"})
			return
		}

		dbRouteStop.StopIndex = routeStop.StopIndex
		err = db.Save(&dbRouteStop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update route stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Route stop updated successfully"})
	}
}

func DeleteRouteStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		routeStop := database.RouteStop{}
		err := db.Where("id=?", id).First(&routeStop).Error
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Route Stop ID"})
			return
		}
		err = db.Delete(&routeStop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete route stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Route stop deleted successfully"})
	}
}
