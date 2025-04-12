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
	Client = redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr,
		DB:       0,
	})

	if err := Client.Ping(Ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}

	SetupSalt(cfg.ServerSalt)
}
