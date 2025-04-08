package user

import (
    "net/http"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

func CreateUserHandler(db *gorm.DB) gin.HandlerFunc {
    svc := NewService(NewRepository(db))
    return func(c *gin.Context) {
        var input User
        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }

        user, err := svc.CreateUser(input)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusCreated, user)
    }
}
