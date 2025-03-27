package routes

import (
	"github/imdinnes/mobusapi/database"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoutes(router *gin.RouterGroup, db *gorm.DB) {
	userRouter := router.Group("/user")

	userRouter.POST("/signup",func(ctx *gin.Context) {
		var user database.User
		ctx.BindJSON(&user)
		// check for request body
		if(user.Email==""|| user.Password==""|| user.Name==""){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Email or password is empty",
			})
			return
		}
		result := db.Where("email = ?", user.Email).First(&user)
		// check if user already exists
		if result.RowsAffected > 0 {
			ctx.JSON(http.StatusConflict,gin.H{
				"message":"User already exists",
			})
			return
		}

		// create user
		user.Balance=0.0;
		db.Create(&user)
		ctx.JSON(http.StatusCreated,gin.H{
			"message":"User created",
		})
		
	})

	userRouter.POST("/signin",func(ctx *gin.Context) {
		user:=database.User{}
		ctx.BindJSON(&user)
		if(user.Email==""|| user.Password==""){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Email or password is empty",
			})
			return
		}
		
		var result database.User
		db.Where("email = ? AND password = ?", user.Email,user.Password).First(&result)
		if(result.ID==0){
			ctx.JSON(http.StatusNotFound,gin.H{
				"message":"User not found. Please Check your credentials",
			})
			return
		}

		ctx.JSON(http.StatusOK,gin.H{
			"message":"User logged in successfully",
		})



		


	})


}
