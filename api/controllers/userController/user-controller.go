package usercontroller

import (
	"github/imdinnes/mobusapi/config"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SignUp(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var user database.User
		if err := ctx.ShouldBindJSON(&user); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request body"})
			return
		}

		if user.Email == "" || user.Password == "" || user.Name == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Email, password, or name cannot be empty",
			})
			return
		}

		result := db.Where("email = ?", user.Email).First(&user)
		if result.RowsAffected > 0 {
			ctx.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
			return
		}

		user.Balance = 0.0
		user.Role = "user"
		db.Create(&user)

		otp := utils.GenerateOTP()
		err := utils.StoreOTP(user.Email, otp, 5*time.Minute)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to store OTP"})
			return
		}
		email := config.NewOnBoardingEmail(user.Name, otp)
		go utils.SendEmail(user.Email, email.Subject, email.Body)

		ctx.JSON(http.StatusCreated, gin.H{
			"message": "A verification email has been sent. Please verify your email.",
		})
	}
}

func SignIn(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		type requestBody struct {
			Email    string `json:"email"`
			Password string `json:"password"`
			DeviceId string `json:"device_id"`
		}
		var user requestBody
		ctx.BindJSON(&user)
		if user.Email == "" || user.Password == "" || user.DeviceId == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Email or password or deviceid is empty",
			})
			return
		}

		var result database.User
		db.Where("email = ? AND password = ?", user.Email, user.Password).First(&result)
		if result.ID == 0 {
			ctx.JSON(http.StatusNotFound, gin.H{
				"message": "User not found. Please Check your credentials",
			})
			return
		}
		accessToken, err := utils.CreateToken(result.Email, result.ID, user.DeviceId, result.Role)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating token",
			})
			return
		}

		refreshToken, err := utils.CreateRefreshToken(result.Email, user.DeviceId, result.Role)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error creating refresh token",
			})
			return
		}
		// Set the refresh token in the database
		// Encrypt the refresh token
		encryptedRefreshToken, err := utils.EncryptToken(refreshToken)
		if err != nil {
			ctx.JSON(500, gin.H{
				"message": "Error encrypting refresh token",
			})
			return
		}
		// Create a new refresh token entry
		refreshTokenEntry := database.RefreshToken{
			UserID:                result.ID,
			EncryptedRefreshToken: encryptedRefreshToken,
			ExpiresAt:             time.Now().Add(7 * 24 * time.Hour), // Set expiry time to 7 days
			DeviceID:              user.DeviceId,
		}

		// Save the refresh token entry to the database
		db.Create(&refreshTokenEntry)

		ctx.JSON(200, gin.H{
			"message":      "User signed in",
			"accessToken":  accessToken,
			"refreshToken": refreshToken,
		})
	}
}

func VerifyEmail(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var request struct {
			Email string `json:"email"`
			OTP   string `json:"otp"`
		}

		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}

		user := database.User{}
		// otp := database.OTP{}

		// Find the user by email
		if err := db.Where("email = ?", request.Email).First(&user).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if user.VerifiedStatus {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "User is already verified"})
			return
		}

		// Check if the OTP is valid
		otpCorrect, err := utils.VerifyOTP(request.Email, request.OTP)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
			return
		}
		if !otpCorrect {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
			return
		}
		if err := db.Model(&user).Update("verified_status", true).Error; err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user verification status"})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Your email has been verified successfully!"})
	}
}



func ResendOTP(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var request struct {
			Email string `json:"email"`
		}
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			return
		}
		user := database.User{}
		// Find the user by email
		if err := db.Where("email = ?", request.Email).First(&user).Error; err != nil {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}

		if user.VerifiedStatus {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "User is already verified"})
			return
		}

		// Check if OTP can be resent (apply cooldown)
		if !utils.CanResendOTP(request.Email, 30*time.Second) { // Cooldown of 30 seconds
			ctx.JSON(http.StatusTooManyRequests, gin.H{"message": "Please wait before requesting a new OTP"})
			return
		}
		// Generate a new OTP
		otp := utils.GenerateOTP()
		err := utils.StoreOTP(user.Email, otp, 5*time.Minute)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to store OTP"})
			return
		}
		email := config.NewOnBoardingEmail(user.Name, otp)
		go utils.SendEmail(user.Email, email.Subject, email.Body)
		ctx.JSON(http.StatusOK, gin.H{"message": "A new OTP has been sent to your email address"})
	}
}

func RefreshToken(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		type requestBody struct {
			RefreshToken string `json:"refresh_token"`
		}

		var body requestBody
		if err := ctx.ShouldBindJSON(&body); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid request",
			})
			return
		}
		if body.RefreshToken == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Refresh token is required",
			})
			return
		}


		newAccessToken, newRefreshToken, err := utils.RefreshAccessToken(body.RefreshToken)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid refresh token",
			})
			return
		}
		ctx.JSON(http.StatusOK, gin.H{
			"message":      "Token refreshed successfully",
			"accessToken":  newAccessToken,
			"refreshToken": newRefreshToken,
		})
	}
}

func ResetPassword(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userid := ctx.GetUint("userId")
		type requestBody struct {
			OldPassword string `json:"old_password"`
			NewPassword string `json:"new_password"`
		}

		var body requestBody
		ctx.BindJSON(&body)

		if body.OldPassword == "" || body.NewPassword == "" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Old password or new password is empty",
			})
			return
		}
		if body.OldPassword == body.NewPassword {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Old password and new password are same",
			})
			return
		}

		user := database.User{}

		db.Where("id=?", userid).First(&user)

		if user.Password != body.OldPassword {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"message": "Old password is incorrect",
			})
			return
		}

		db.Model(&user).Update("password", body.NewPassword)
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Password updated successfully"})
	}
}

func Logout(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Get token from Authorization header
		token := ctx.GetHeader("Authorization")
		if token == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Token is required",
			})
			return
		}
		// Get user ID and device ID from context
		userID := ctx.GetUint("userId")
		deviceID := ctx.GetString("deviceId")
		if userID == 0 || deviceID == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "User ID or device ID is missing",
			})
			return
		}
		// Get the expiry time of the token
		expiryTime, err := utils.GetExpiryTime(token)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get expiry time"})
			return
		}

		// Calculate the time until expiry
		timeUntilExpiry := time.Until(expiryTime)

		// Blacklist the token for the specific user and device
		err = utils.BlacklistToken(userID, deviceID, token, timeUntilExpiry)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to blacklist token"})
			return
		}

		// Delete the refresh token for the specific user & device
		db := database.SetupDatabase(config.Load())
		refreshTokenEntry := database.RefreshToken{}
		db.Where("user_id = ? AND device_id = ?", userID, deviceID).First(&refreshTokenEntry)
		if refreshTokenEntry.ID != 0 {
			db.Delete(&refreshTokenEntry)
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
	}
}

func Profile(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")
		user := database.User{}
		db.Where("id = ?", userId).First(&user)
		ctx.JSON(http.StatusOK, gin.H{
			"user":    user.Email,
			"balance": user.Balance,
			"role":    user.Role,
		})
	}
}