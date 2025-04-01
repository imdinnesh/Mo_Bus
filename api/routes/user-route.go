package routes

import (
	"github/imdinnes/mobusapi/controllers/userController"
	"github/imdinnes/mobusapi/middleware"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UserRoutes(router *gin.RouterGroup, db *gorm.DB) {
	userRouter := router.Group("/user")

	userRouter.POST("/signup",usercontroller.SignUp(db))

	userRouter.POST("/verify-email",usercontroller.VerifyEmail(db))

	userRouter.POST("/resend-otp",usercontroller.ResendOTP(db))

	userRouter.POST("/signin",usercontroller.SignIn(db))

	userRouter.POST("/refresh-token",usercontroller.RefreshToken(db))

	userRouter.PATCH("/reset-password",middleware.AuthMiddleware(),usercontroller.ResetPassword(db))

	userRouter.POST("/logout", middleware.AuthMiddleware(), usercontroller.Logout(db))

	userRouter.GET("/profile",middleware.AuthMiddleware(),usercontroller.Profile(db))



}
