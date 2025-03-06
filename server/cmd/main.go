package main

import (
	"os"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/routes"
	"github.com/joho/godotenv"
	"github.com/gin-contrib/cors"
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

	r.Use((cors.Default()))
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
