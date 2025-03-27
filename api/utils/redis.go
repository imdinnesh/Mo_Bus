package utils

import (
	"context"
	"fmt"
	"time"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

// Initialize Redis client
var RedisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

// Blacklist a JWT token
func BlacklistToken(token string, expiry time.Duration) error {
	err := RedisClient.Set(ctx, token, "blacklisted", expiry).Err()
	if err != nil {
		return fmt.Errorf("failed to blacklist token: %v", err)
	}
	return nil
}

// Check if a JWT token is blacklisted
func IsTokenBlacklisted(token string) bool {
	_, err := RedisClient.Get(ctx, token).Result()
	return err == nil // If the token exists in Redis, it is blacklisted
}
