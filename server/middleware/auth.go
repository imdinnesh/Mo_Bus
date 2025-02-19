package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mo_bus/utils"
)

func ProtectedMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("token")
		if err != nil {
			ctx.JSON(401, gin.H{
				"message": "Authorization token is required",
			})
			ctx.Abort()
			return
		}

		email, err := utils.VerifyToken(tokenString)
		if err != nil {
			ctx.JSON(401, gin.H{
				"message": "Invalid token",
			})
			ctx.Abort()
			return
		}

		ctx.Set("email", email)
		ctx.Next()
	}
}
