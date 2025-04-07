package main

import (
	"fmt"
	"github/imdinnes/mobusapi/crons"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/routes"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	db := database.SetupDatabase()
	fmt.Println("Database connected")
	crons.StartCronJobs(db)
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Your Next.js app URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	// adding a test route
	r.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Hello World",
		})
	})
	//

	// route groups
	baseRoute := r.Group(("/api/v1"))
	routes.UserRoutes(baseRoute, db)
	routes.AdminRoutes(baseRoute, db)
	routes.RouteRoutes(baseRoute, db)
	routes.StopRoutes(baseRoute, db)
	routes.RouteStops(baseRoute, db)
	routes.PaymentRoutes(baseRoute, db)
	routes.BookingRoutes(baseRoute, db)
	routes.QrCodeRoutes(baseRoute, db)
	routes.ProfileRoutes(baseRoute,db)
	r.Run(":8080")

}
