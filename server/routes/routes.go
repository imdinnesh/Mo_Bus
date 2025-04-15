package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/internal/admin"
	"github.com/imdinnesh/mobusapi/internal/profile"
	"github.com/imdinnesh/mobusapi/internal/routeno"
	"github.com/imdinnesh/mobusapi/internal/user"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup,db *gorm.DB){
	user.RegisterRoutes(r, db)
	admin.RegisterRoutes(r,db)
	profile.RegisterRoutes(r,db)
	routeno.RegisterRoutes(r,db)

}