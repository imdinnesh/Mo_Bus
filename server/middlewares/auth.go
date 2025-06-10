package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/jwt"
)

func AuthMiddleware2() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var token string

		// Try to get token from Authorization header
		if headerToken := ctx.GetHeader("Authorization"); headerToken != "" {
			token = headerToken
		} else {
			// Fallback: try to get token from cookie
			cookieToken, err := ctx.Cookie("access_token")
			if err != nil {
				ctx.JSON(http.StatusUnauthorized, gin.H{
					"error": "No token provided",
				})
				ctx.Abort()
				return
			}
			token = cookieToken
		}

		// Verify the token
		email, id, deviceID, role, err := jwt.VerifyToken(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token: " + err.Error(),
			})
			ctx.Abort()
			return
		}

		// Set user details in context for downstream handlers
		ctx.Set("email", email)
		ctx.Set("userId", id)
		ctx.Set("deviceId", deviceID)
		ctx.Set("role", role)

		ctx.Next()
	}
}

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var token string

		cookieToken, _ := ctx.Cookie("access_token")

		if cookieToken != "" {
			token = cookieToken
		} else {
			headerToken := ctx.GetHeader("Authorization")
			if headerToken != "" {
				token = headerToken
			} else {
				ctx.JSON(http.StatusUnauthorized, gin.H{
					"error": "No token provided",
				})
				ctx.Abort()
				return
			}
		}
		email, id, deviceID, role, err := jwt.VerifyToken(token)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid token: " + err.Error(),
			})
			ctx.Abort()
			return
		}

		// Set user details in context for downstream handlers
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
