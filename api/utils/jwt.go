package utils

import (
	"fmt"
	"github/imdinnes/mobusapi/database"
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
// func RefreshAccessToken(refreshToken string,dbRefreshToken string) (string, string, error) {
// 	token, err := jwt.ParseWithClaims(refreshToken, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
// 		return refreshSecretKey, nil
// 	})

// 	if err != nil || !token.Valid {
// 		return "", "", fmt.Errorf("invalid refresh token")
// 	}

// 	claims, ok := token.Claims.(jwt.MapClaims)
// 	if !ok {
// 		return "", "", fmt.Errorf("invalid token claims")
// 	}

// 	email, ok := claims["email"].(string)
// 	if !ok {
// 		return "", "", fmt.Errorf("invalid email")
// 	}

// 	// Check if the refresh token is present in the database


// 	// Generate new tokens
// 	newAccessToken, _ := CreateToken(email)
// 	newRefreshToken, _ := CreateRefreshToken(email)

// 	return newAccessToken, newRefreshToken, nil
// }

// VerifyRefreshToken checks the validity of a refresh token
func RefreshAccessToken(refreshToken string) (string,string,error) {
	token, err := jwt.ParseWithClaims(refreshToken, jwt.MapClaims{}, func(token *jwt.Token) (interface{}, error) {
		return refreshSecretKey, nil
	})

	if err != nil || !token.Valid {
		return "","", fmt.Errorf("invalid refresh token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", "",fmt.Errorf("invalid token claims")
	}

	email, ok := claims["email"].(string)
	if !ok {
		return "","", fmt.Errorf("invalid email")
	}

	// Check if the refresh token is present in the database
	db:=database.SetupDatabase();

	user:=database.User{}

	db.Where("email=?",email).First(&user)

	refreshTokenEntry:=database.RefreshToken{}
	db.Where("user_id=?",user.ID).First(&refreshTokenEntry)

	if refreshTokenEntry.ID==0{
		return "","", fmt.Errorf("refresh token not found in database.Please login again")
	}

	// Decrypt the refresh token
	decryptedRefreshToken,err:=DecryptToken(refreshTokenEntry.EncryptedRefreshToken)
	if err!=nil{
		return "","", fmt.Errorf("error decrypting refresh token")
	}

	if decryptedRefreshToken!=refreshToken{
		return "","", fmt.Errorf("refresh token is not valid")
	}

	// Generate new tokens
	newAccessToken, err := CreateToken(email)
	if err != nil {
		return "","", fmt.Errorf("error creating new access token")
	}
	newRefreshToken, err := CreateRefreshToken(email)
	if err != nil {
		return "","", fmt.Errorf("error creating new refresh token")
	}
	// Update the refresh token in the database
	encryptedRefreshToken, err := EncryptToken(newRefreshToken)
	if err != nil {
		return "","", fmt.Errorf("error encrypting new refresh token")
	}
	refreshTokenEntry.EncryptedRefreshToken = encryptedRefreshToken
	db.Save(&refreshTokenEntry)
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
