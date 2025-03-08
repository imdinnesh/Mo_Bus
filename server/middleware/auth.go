package middleware

import (
    "github.com/gin-gonic/gin"
    "github.com/imdinnesh/mo_bus/database"
    "github.com/imdinnesh/mo_bus/utils"
)

func ProtectedMiddleware() gin.HandlerFunc {
    return func(ctx *gin.Context) {
        // Check for token in Authorization header
        tokenString := ctx.GetHeader("Authorization")

        if tokenString == "" {
            // If no token in Authorization header, check cookies
            tokenString, _ = ctx.Cookie("token")
        } else {
            // If token is in Authorization header, remove "Bearer " prefix
            tokenString = tokenString[7:]
        }

        if tokenString == "" {
            // Token is missing
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

        var user database.User
        db := database.SetupDatabase()
        db.Where("email = ?", email).First(&user)

        ctx.Set("email", email)
        ctx.Set("userId", user.ID)

        ctx.Next()
    }
}