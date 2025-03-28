package routes

import (
	"fmt"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"github/imdinnes/mobusapi/utils"
	"net/http"
	"time"
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
		accessToken, err := utils.CreateToken(result.Email,result.ID)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating token",
			})
			return
		}

		refreshToken,err:=utils.CreateRefreshToken(result.Email)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating refresh token",
			})
			return
		}
		// Set the refresh token in the database
		// Encrypt the refresh token
		encryptedRefreshToken, err := utils.EncryptToken(refreshToken)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error encrypting refresh token",
			})
			return
		}
		// Create a new refresh token entry
		refreshTokenEntry:=database.RefreshToken{
			UserID: result.ID,
			EncryptedRefreshToken:encryptedRefreshToken,
			ExpiresAt: time.Now().Add(7 * 24 * time.Hour), // Set expiry time to 7 days
		}

		// Save the refresh token entry to the database
		db.Create(&refreshTokenEntry)
		
		ctx.JSON(200, gin.H{
			"message": "User signed in",
			"accessToken": accessToken,
			"refreshToken": refreshToken,
		})
		
	})

	// Refresh Token

	userRouter.POST("/refresh-token",func(ctx *gin.Context) {
		// Get the refresh token from the request
		type requestBody struct {
			RefreshToken string `json:"refresh_token"`
		}

		var body requestBody
		if err := ctx.ShouldBindJSON(&body); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid request",
			})
			return
		}
		if body.RefreshToken == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Refresh token is required",
			})
			return
		}

		newAccessToken,newRefreshToken,err:=utils.RefreshAccessToken(body.RefreshToken)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid refresh token",
			})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Token refreshed successfully",
			"accessToken": newAccessToken,
			"refreshToken": newRefreshToken,
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

	userRouter.POST("/logout", middleware.AuthMiddleware(), func(ctx *gin.Context) {
		// Get token from Authorization header
		token:=ctx.GetHeader("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Token is required",
			})
			return
		}

		// Get the expiry time of the token
		expiryTime,err:=utils.GetExpiryTime(token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get expiry time"})
			return
		}
		// Calculate the time until expiry
		timeUntilExpiry := time.Until(expiryTime)
		fmt.Println(timeUntilExpiry)
		err = utils.BlacklistToken(token, timeUntilExpiry)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to blacklist token"})
			return
		}

		// Delete the refresh token from the database

		userId := ctx.GetUint("userId")

		refreshTokenEntry := database.RefreshToken{}
		db.Where("user_id = ?", userId).First(&refreshTokenEntry)
		if refreshTokenEntry.ID != 0 {
			db.Delete(&refreshTokenEntry)
		}
	
		ctx.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
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
