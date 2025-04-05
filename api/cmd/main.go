package main

import (
	"fmt"
	"github/imdinnes/mobusapi/crons"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {

	db := database.SetupDatabase()
	fmt.Println("Database connected")
	crons.StartCronJobs(db)
	r := gin.Default()
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
	routes.BookingRoutes(baseRoute,db)
	routes.QrCodeRoutes(baseRoute,db)
	r.Run(":8080")

}
