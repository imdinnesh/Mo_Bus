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

	r.Run(":8080")

}
