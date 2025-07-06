package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/routes"
	"gorm.io/gorm"
	"time"
)

func New(cfg *config.Config, db *gorm.DB) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			allowed := map[string]bool{
				"http://localhost:3000":     true,
				"http://localhost:3001":     true,
				"https://mo-bus.vercel.app": true,
				"https://mo-bus-platform.vercel.app": true,
				"https://mo-bus-client.vercel.app":true,
			}
			return allowed[origin]
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// test route
	r.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{"message": "Hello World"})
	})

	api := r.Group("/api/v1")
	routes.RegisterRoutes(api, db)
	return r
}
