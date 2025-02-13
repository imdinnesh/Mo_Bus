package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	Email    string `json:"email"` 
	Password string `json:"password"`
}

func main() {

	dsn:= "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic(err)
	}

	db.AutoMigrate(&User{})



	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router := r.Group("/")

	userRouter := router.Group("/user")

	userRouter.POST("/signup", func(ctx *gin.Context) {
		var user User
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

	userRouter.POST("/signin",func(ctx *gin.Context) {
		var user User
		ctx.BindJSON(&user)

		if user.Email == "" || user.Password == "" {
			ctx.JSON(400, gin.H{
				"message": "Email or password is empty",
			})
			return
		}

		var userDB User

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

		ctx.JSON(200, gin.H{
			"message": "User signed in",
		})

	})



	r.Run(":8080")

}
