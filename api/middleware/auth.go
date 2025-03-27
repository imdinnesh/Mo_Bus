package middleware

import (
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc{
	return func(ctx *gin.Context) {
		token:=ctx.GetHeader("Authorization")
		if(token==""){
			ctx.JSON(http.StatusUnauthorized,gin.H{
				"message":"Authorization token is required",
			})
			ctx.Abort()
			return
		}
		email,err:=utils.VerifyToken(token)

		if (err!=nil){
			ctx.JSON(http.StatusUnauthorized,gin.H{
				"message":"Invalid token",
			})
			ctx.Abort()
			return

		}
		user:=database.User{}
		db:=database.SetupDatabase()
		db.Where("email=?",email).First(&user)
		ctx.Set("email", email)
        ctx.Set("userId", user.ID)

        ctx.Next()
	}

}