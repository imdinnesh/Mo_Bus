package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/segmentio/kafka-go"
)

type GPSData struct {
	BusID     string  `json:"busId"`
	RouteID   string  `json:"routeId"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp string  `json:"timestamp"`
}

const (
	kafkaTopic  = "gps-coordinates"
	kafkaBroker = "localhost:9092"
	redisAddr   = "localhost:6379"
)

var (
	ctx         = context.Background()
	redisClient *redis.Client
)

func initRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: redisAddr,
		DB:   0,
	})

	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
}

func main() {
	initRedis()

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaBroker},
		Topic:   kafkaTopic,
		GroupID: "gps-consumer-group",
	})

	log.Println("Kafka Consumer started and listening...")

	for {
		msg, err := r.ReadMessage(ctx)
		if err != nil {
			log.Printf("Error reading message: %v", err)
			continue
		}

		var data GPSData
		if err := json.Unmarshal(msg.Value, &data); err != nil {
			log.Printf("Error decoding message: %v", err)
			continue
		}

		// Store in Redis: key `bus:<busId>`
		key := fmt.Sprintf("bus:%s", data.BusID)
		err = redisClient.HSet(ctx, key, map[string]interface{}{
			"routeId":   data.RouteID,
			"latitude":  data.Latitude,
			"longitude": data.Longitude,
			"timestamp": data.Timestamp,
		}).Err()

		if err != nil {
			log.Printf("Redis error: %v", err)
			continue
		}

		// Optional: Add TTL for auto-expiry
		redisClient.Expire(ctx, key, 5*time.Minute)

		log.Printf("Stored %s in Redis", key)
	}
}
