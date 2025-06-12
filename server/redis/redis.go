package redis

import (
	"context"
	"log"
	"github.com/imdinnesh/mobusapi/config"
	"github.com/redis/go-redis/v9"
)

var (
	Client *redis.Client
	Ctx    = context.Background()
)

func InitRedis(cfg *config.Config) {
	// [Local Redis connection]--------

	// Client = redis.NewClient(&redis.Options{
	// 	Addr:     cfg.RedisAddr,
	// 	Password: cfg.RedisPass,
	// 	DB:       0,
	// })

	// [Connection String Redis connection]--------

	opt, _ := redis.ParseURL(cfg.RedisConnectionStr)
	Client = redis.NewClient(opt)

	if err := Client.Ping(Ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	SetupSalt(cfg.ServerSalt)
}
