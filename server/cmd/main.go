package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var secretKey = []byte("secret-key")

func createToken(email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email": email,
			"exp":   time.Now().Add(time.Hour * 24).Unix(),
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func verifyToken(tokenString string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", fmt.Errorf("invalid email")
	}

	return email, nil
}

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {

	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
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

	userRouter.POST("/signin", func(ctx *gin.Context) {
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

		// token
		tokenString, err := createToken(userDB.Email)

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

	// creating a middleware for authentication (a separate function)

	protectedMiddleware := func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("token")
		if err != nil {
			ctx.JSON(401, gin.H{
				"message": "Authorization token is required",
			})
			ctx.Abort()
			return
		}

		if tokenString == "" {
			ctx.JSON(401, gin.H{
				"message": "Authorization token is required",
			})
			ctx.Abort()
			return
		}

		email, err := verifyToken(tokenString)
		if err != nil {
			ctx.JSON(401, gin.H{
				"message": "Invalid token",
			})
			ctx.Abort()
			return
		}

		ctx.Set("email", email)
		ctx.Next()
	}

	userRouter.GET("/profile", protectedMiddleware, func(ctx *gin.Context) {
		email := ctx.MustGet("email").(string)
		ctx.JSON(200, gin.H{
			"message": "Profile accessed",
			"email":   email,
		})
	})

	r.Run(":8080")

}
