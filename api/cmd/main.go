package main

import (
	"fmt"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/routes"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main(){

	db:=database.SetupDatabase()
	fmt.Println("Database connected")

	r:=gin.Default();
	// adding a test route
	r.GET("/test",func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK,gin.H{
			"message":"Hello World",
		})
	})

	// route groups
	baseRoute:=r.Group(("/api/v1"));
	routes.UserRoutes(baseRoute,db)
	routes.AdminRoutes(baseRoute,db)
	
	r.Run((":8080"))

}

