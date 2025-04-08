package utils

import (
	"fmt"
	"github/imdinnes/mobusapi/config"
	"github/imdinnes/mobusapi/database"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")
var refreshSecretKey = []byte("refresh-secret-key")

func CreateToken(email string, id uint, deviceID string, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email":     email,
			"id":        float64(id), // Store as float64 for compatibility
			"device_id": deviceID,
			"role":      role,                                    // Include role in token
			"exp":       time.Now().Add(time.Minute * 30).Unix(), // 30 min expiry
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func VerifyToken(tokenString string) (string, uint, string, string, error) {
	// Parse JWT token
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil || !token.Valid {
		return "", 0, "", "", fmt.Errorf("invalid token")
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", 0, "", "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", 0, "", "", fmt.Errorf("invalid email")
	}

	// Retrieve id as float64 and convert to uint
	idFloat, ok := claims["id"].(float64)
	if !ok {
		return "", 0, "", "", fmt.Errorf("invalid id format")
	}
	userID := uint(idFloat)

	// Retrieve deviceID (ensure it's a string)
	deviceID, ok := claims["device_id"].(string)
	if !ok {
		return "", 0, "", "", fmt.Errorf("invalid device ID")
	}

	// Retrieve role
	role, ok := claims["role"].(string)
	if !ok {
		return "", 0, "", "", fmt.Errorf("invalid role")
	}

	// Check if token is blacklisted
	if IsTokenBlacklisted(userID, deviceID, tokenString) {
		return "", 0, "", "", fmt.Errorf("token is blacklisted")
	}

	return email, userID, deviceID, role, nil
}

func CreateRefreshToken(email string, deviceID string, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email":     email,
			"device_id": deviceID,
			"role":      role,                                      // Include role
			"exp":       time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days expiry
		})

	tokenString, err := token.SignedString(refreshSecretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func RefreshAccessToken(refreshToken string) (string, string, error) {
	// Parse the refresh token
	token, err := jwt.ParseWithClaims(refreshToken, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return refreshSecretKey, nil
	})

	if err != nil || !token.Valid {
		return "", "", fmt.Errorf("invalid refresh token")
	}

	// Extract claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid email")
	}

	deviceID, ok := claims["device_id"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid device ID")
	}

	role, ok := claims["role"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid role")
	}

	// Check if the refresh token exists in the database
	db := database.SetupDatabase(config.Load())

	user := database.User{}
	db.Where("email = ?", email).First(&user)

	refreshTokenEntry := database.RefreshToken{}
	db.Where("user_id = ? AND device_id = ?", user.ID, deviceID).First(&refreshTokenEntry)

	if refreshTokenEntry.ID == 0 {
		return "", "", fmt.Errorf("refresh token not found in database. Please login again")
	}

	// Decrypt and verify the refresh token
	decryptedRefreshToken, err := DecryptToken(refreshTokenEntry.EncryptedRefreshToken)
	if err != nil {
		return "", "", fmt.Errorf("error decrypting refresh token")
	}

	if decryptedRefreshToken != refreshToken {
		return "", "", fmt.Errorf("refresh token is not valid")
	}

	// Generate new tokens using the same role and device ID
	newAccessToken, err := CreateToken(email, user.ID, deviceID, role)
	if err != nil {
		return "", "", fmt.Errorf("error creating new access token")
	}

	newRefreshToken, err := CreateRefreshToken(email, deviceID, role)
	if err != nil {
		return "", "", fmt.Errorf("error creating new refresh token")
	}

	// Encrypt and update the new refresh token in the database
	encryptedRefreshToken, err := EncryptToken(newRefreshToken)
	if err != nil {
		return "", "", fmt.Errorf("error encrypting new refresh token")
	}

	refreshTokenEntry.EncryptedRefreshToken = encryptedRefreshToken
	db.Save(&refreshTokenEntry)

	return newAccessToken, newRefreshToken, nil
}

func GetExpiryTime(tokenString string) (time.Time, error) {
	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return time.Time{}, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return time.Time{}, fmt.Errorf("invalid token claims")
	}

	exp, ok := claims["exp"].(float64)
	if !ok {
		return time.Time{}, fmt.Errorf("invalid expiry time format")
	}

	return time.Unix(int64(exp), 0), nil
}
