package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/jwt"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization token is required",
			})
			ctx.Abort()
			return
		}
		email, id, deviceID, role, err := jwt.VerifyToken(token)

		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error":err.Error(),
			})
			ctx.Abort()
			return

		}

		ctx.Set("email", email)
		ctx.Set("userId", id)
		ctx.Set("deviceId", deviceID)
		ctx.Set("role", role)
		ctx.Next()
	}

}

func AdminMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		role := ctx.GetString("role")
		if role != "admin" {
			ctx.JSON(http.StatusForbidden, gin.H{
				"error": "You are not authorized to access this resource",
			})
			ctx.Abort()
			return
		}
		ctx.Next()
	}
}
