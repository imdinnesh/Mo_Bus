package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/middleware"
	"github.com/imdinnesh/mo_bus/utils"
	"gorm.io/gorm"
)

func UserRoutes(router *gin.RouterGroup, db *gorm.DB) {
	userRouter := router.Group("/user")

	userRouter.POST("/signup", func(ctx *gin.Context) {
		var user database.User
		ctx.BindJSON(&user)

		if user.Email == "" || user.Password == "" {
			ctx.JSON(400, gin.H{
				"message": "Email or password is empty",
			})
			return
		}

		db.Create(&user)

		ctx.JSON(200, gin.H{
			"message": "User created",
		})
	})

	userRouter.POST("/signin", func(ctx *gin.Context) {
		var user database.User
		ctx.BindJSON(&user)

		if user.Email == "" || user.Password == "" {
			ctx.JSON(400, gin.H{
				"message": "Email or password is empty",
			})
			return
		}

		var userDB database.User

		db.Where("email = ?", user.Email).First(&userDB)

		if userDB.Email == "" {
			ctx.JSON(404, gin.H{
				"message": "User not found. Check credentials",
			})
			return
		}

		if userDB.Password != user.Password {
			ctx.JSON(401, gin.H{
				"message": "Invalid password",
			})
			return
		}

		tokenString, err := utils.CreateToken(userDB.Email)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating token",
			})
			return
		}

		ctx.SetCookie("token", tokenString, 3600, "/", "localhost", false, true)

		ctx.JSON(200, gin.H{
			"message": "User signed in",
		})
	})

	userRouter.GET("/profile", middleware.ProtectedMiddleware(), func(ctx *gin.Context) {
		email := ctx.GetString("email")
		ctx.JSON(200, gin.H{
			"message": "Profile accessed",
			"email":   email,
		})
	})

	userRouter.POST("/signout", func(ctx *gin.Context) {
		ctx.SetCookie("token", "", -1, "/", "localhost", false, true)
		ctx.JSON(200, gin.H{
			"message": "User signed out",
		})
	})

}
