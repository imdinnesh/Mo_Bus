package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")
var refreshSecretKey = []byte("refresh-secret-key")

// Create JWT token
func CreateToken(email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email": email,
			"exp":   time.Now().Add(time.Minute * 30).Unix(), // 30 min expiry
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// Verify JWT token and check if it is blacklisted
func VerifyToken(tokenString string) (string, error) {
	if IsTokenBlacklisted(tokenString) {
		return "", fmt.Errorf("token is blacklisted")
	}

	token, err := jwt.ParseWithClaims(tokenString, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", fmt.Errorf("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", fmt.Errorf("invalid email")
	}
	return email, nil
}

// Function to create a refresh token
func CreateRefreshToken(email string)(string,error){
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email": email,
			"exp":   time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days expiry
		})
	tokenString, err := token.SignedString(refreshSecretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// Verify Refresh Token and issue a new access token
func RefreshAccessToken(refreshToken string) (string, string, error) {
	token, err := jwt.ParseWithClaims(refreshToken, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return refreshSecretKey, nil
	})

	if err != nil || !token.Valid {
		return "", "", fmt.Errorf("invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "", fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "", "", fmt.Errorf("invalid email")
	}

	// Generate new tokens
	newAccessToken, _ := CreateToken(email)
	newRefreshToken, _ := CreateRefreshToken(email)

	return newAccessToken, newRefreshToken, nil
}

// Function to get the expiry time of a token
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
