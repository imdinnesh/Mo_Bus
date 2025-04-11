package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
)

func AnnouncementRoutes(router *gin.RouterGroup,db *gorm.DB) {
	AccouncementRouter:=router.Group("/announcement",middleware.AuthMiddleware())
	AccouncementRouter.POST("/create", func(c *gin.Context) {
		announcement:=&database.Accouncements{}
		if err := c.ShouldBindJSON(&announcement); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		if announcement.Title == "" || announcement.Description == ""|| announcement.Type == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		if err := db.Create(&announcement).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create announcement"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Announcement created successfully"})

	})

	
	
}