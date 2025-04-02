package utils

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

// Initialize Redis client
var RedisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

// Secret salt
var serverSalt = "your-secret-salt"


func HashToken(token string) string {
	h := hmac.New(sha256.New, []byte(serverSalt))
	h.Write([]byte(token))
	return hex.EncodeToString(h.Sum(nil))
}

// Blacklist a JWT token for a specific device
func BlacklistToken(userID uint, deviceID, token string, expiry time.Duration) error {
	redisKey := fmt.Sprintf("blacklist:%d:%s", userID, deviceID)
	hashedToken := HashToken(token)

	err := RedisClient.Set(ctx, redisKey, hashedToken, expiry).Err()
	if err != nil {
		return fmt.Errorf("failed to blacklist token: %v", err)
	}
	return nil
}

// Check if a JWT token is blacklisted for a specific device
func IsTokenBlacklisted(userID uint, deviceID, token string) bool {
	redisKey := fmt.Sprintf("blacklist:%d:%s", userID, deviceID)
	storedToken, err := RedisClient.Get(ctx, redisKey).Result()
	if err != nil {
		return false
	}

	return storedToken == HashToken(token) // Compare hashed values
}

// Store OTP in Redis
func StoreOTP(email string, otp string, expiry time.Duration) error {
	otpKey := "otp:" + email
	return RedisClient.Set(ctx, otpKey, otp, expiry).Err()
}

// Check OTP resend cooldown
func CanResendOTP(email string, cooldown time.Duration) bool {
	cooldownKey := "otp_cooldown:" + email
	if _, err := RedisClient.Get(ctx, cooldownKey).Result(); err == nil {
		return false // Cooldown active
	}
	RedisClient.Set(ctx, cooldownKey, "1", cooldown)
	return true
}

// Retrieve and verify OTP from Redis
func VerifyOTP(email string, enteredOTP string) (bool, error) {
	otpKey := "otp:" + email
	storedOTP, err := RedisClient.Get(ctx, otpKey).Result()
	if err == redis.Nil {
		return false, fmt.Errorf("OTP expired or not found")
	} else if err != nil {
		return false, err
	}

	if storedOTP == enteredOTP {
		RedisClient.Del(ctx, otpKey) // OTP is single-use
		return true, nil
	}
	return false, fmt.Errorf("invalid OTP")
}