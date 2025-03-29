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

// Secret salt for additional security
var serverSalt = "your-secret-salt" // Ideally, load from environment variables

// HashToken generates a secure hash of the token with the server salt
func HashToken(token string) string {
	h := hmac.New(sha256.New, []byte(serverSalt))
	h.Write([]byte(token))
	return hex.EncodeToString(h.Sum(nil))
}

// Blacklist a JWT token for a specific device
func BlacklistToken(userID uint, deviceID, token string, expiry time.Duration) error {
	redisKey := fmt.Sprintf("blacklist:%d:%s", userID, deviceID)
	hashedToken := HashToken(token) // Hash the token before storing it

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
