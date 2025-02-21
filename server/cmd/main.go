package main

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/database"
	"github.com/imdinnesh/mo_bus/routes"
)

func main() {
	db := database.SetupDatabase()
	// database.SeedDatabase(db)

	r := gin.Default()
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
	routes.QRCodeRoutes(router)

	r.Run(":8080")
}
