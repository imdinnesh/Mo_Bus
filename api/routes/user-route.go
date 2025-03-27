package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"github/imdinnes/mobusapi/utils"
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
		tokenString, err := utils.CreateToken(result.Email)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating token",
			})
			return
		}
		
		ctx.JSON(200, gin.H{
			"message": "User signed in",
			"token": tokenString,
		})
		
	})

	userRouter.PATCH("/reset-password",middleware.AuthMiddleware(),func(ctx *gin.Context) {
		userid:=ctx.GetUint("userId")
		type requestBody struct{
			OldPassword string `json:"old_password"`
			NewPassword string `json:"new_password"`
		}

		var body requestBody
		ctx.BindJSON(&body)

		if(body.OldPassword==""|| body.NewPassword==""){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Old password or new password is empty",
			})
			return
		}
		if(body.OldPassword==body.NewPassword){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Old password and new password are same",
			})
			return
		}

		user:=database.User{}

		db.Where("id=?",userid).First(&user)

		if(user.Password!=body.OldPassword){
			ctx.JSON(http.StatusBadRequest,gin.H{
				"message":"Old password is incorrect",
			})
			return
		}

		db.Model(&user).Update("password",body.NewPassword)
		ctx.JSON(http.StatusOK,gin.H{
			"message":"Password updated successfully",})

		
	})



	userRouter.GET("/profile",middleware.AuthMiddleware(),func(ctx *gin.Context) {
		userId:=ctx.GetUint("userId")
		user:=database.User{}
		db.Where("id = ?", userId).First(&user)
		ctx.JSON(http.StatusOK,gin.H{
			"user":user.Email,
			"balance":user.Balance,
		})

	})



}
