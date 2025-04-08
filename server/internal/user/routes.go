package user

import (
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func RegisterRoutes(rg *gin.RouterGroup, db *gorm.DB) {
    userGroup := rg.Group("/users")
    userGroup.POST("/", CreateUserHandler(db))
}
