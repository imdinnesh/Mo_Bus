package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AnnouncementRoutes(router *gin.RouterGroup) {
	AccouncementRouter:=router.Group("/announcement",middleware.AuthMiddleware())
	AccouncementRouter.POST("/create", func(c *gin.Context) {

	})
	
}