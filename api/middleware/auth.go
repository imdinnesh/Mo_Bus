package middleware

import (
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
		email,id,err:=utils.VerifyToken(token)

		if (err!=nil){
			ctx.JSON(http.StatusUnauthorized,gin.H{
				"message":"Invalid token",
			})
			ctx.Abort()
			return

		}
		ctx.Set("email", email)
        ctx.Set("userId", id)

        ctx.Next()
	}

}