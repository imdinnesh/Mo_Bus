package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/internal/user"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup,db *gorm.DB){
	user.RegisterRoutes(r, db)

}