package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func StopRoutes(router *gin.RouterGroup, db *gorm.DB) {
	stopRouter:= router.Group("/stop",middleware.AuthMiddleware(),middleware.AdminMiddleware())

	stopRouter.POST("/add-stop",func(ctx *gin.Context) {
		stop:=database.Stop{}
		ctx.BindJSON(&stop)

		if(stop.StopName==""){
			ctx.JSON(http.StatusBadRequest,gin.H{"error":"Stop name is required"})
			return
		}

		err:=db.Create(&stop).Error
		if err!=nil{
			ctx.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to add stop"})
			return
		}
		ctx.JSON(http.StatusOK,gin.H{"message":"Stop added successfully"})
	})

	stopRouter.PUT("/update-stop/:id",func(ctx *gin.Context) {
		id:=ctx.Param("id")
		stop:=database.Stop{}
		ctx.BindJSON(&stop)

		if(stop.StopName==""){
			ctx.JSON(http.StatusBadRequest,gin.H{"error":"Stop name is required"})
			return
		}

		err:=db.Model(&stop).Where("id=?",id).Updates(stop).Error
		if err!=nil{
			ctx.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to update stop"})
			return
		}
		ctx.JSON(http.StatusOK,gin.H{"message":"Stop updated successfully"})
	})


}