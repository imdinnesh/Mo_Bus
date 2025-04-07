package stopcontroller

import (
	"github/imdinnes/mobusapi/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func AddStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		stop := database.Stop{}
		ctx.BindJSON(&stop)

		if stop.StopName == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stop name is required"})
			return
		}

		err := db.Create(&stop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Stop added successfully"})
	}
}

func UpdateStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		stop := database.Stop{}
		ctx.BindJSON(&stop)

		if stop.StopName == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Stop name is required"})
			return
		}

		err := db.Model(&stop).Where("id=?", id).Updates(stop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Stop updated successfully"})
	}
}

func DeleteStop(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		stop := database.Stop{}
		db.Where("id=?", id).Find(&stop)
		if stop.ID == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Stop not found"})
			return
		}

		err := db.Delete(&stop).Error
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete stop"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"message": "Stop deleted successfully"})
	}
}
