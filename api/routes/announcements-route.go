package routes

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/middleware"
	"net/http"
	"gorm.io/gorm"
	"github.com/gin-gonic/gin"
	"strconv"
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

	AccouncementRouter.GET("/",func(ctx *gin.Context) {
		page:=ctx.Query("page")
		var announcements []database.Accouncements
		pageInt, err := strconv.Atoi(page)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
			return
		}
		if pageInt < 1 {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Page number must be greater than 0"})
			return
		}

		if err := db.Offset((pageInt-1)*10).Limit(10).Find(&announcements).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch announcements"})
			return
		}
		if len(announcements) == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{"message": "No announcements found"})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{"announcements": announcements})			
	
	})


	
}