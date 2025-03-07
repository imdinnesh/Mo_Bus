package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/routes"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
	"time"
)

func main() {
	db := database.SetupDatabase()
	// database.SeedDatabase(db)

	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}



	r := gin.Default()
	//Adding a test route

	r.Use(cors.New(cors.Config{
        AllowOrigins:     []string{"http://localhost:3000"}, // Your Next.js app URL
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router := r.Group("/")
	routes.UserRoutes(router, db)
	routes.PaymentRoutes(router, db)
	routes.SearchRoutes(router, db)
	routes.BookingRoutes(router, db)
	routes.QRCodeRoutes(router, db)
	routes.DashboardRoutes(router, db)

	port:=os.Getenv("PORT")

	r.Run(":"+port)
}
