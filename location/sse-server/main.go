package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/go-redis/redis/v8"
)

var (
	ctx         = context.Background()
	redisClient *redis.Client
)

func initRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatal("Redis connection failed:", err)
	}
}

func handleSSE(w http.ResponseWriter, r *http.Request) {
	busID := r.URL.Query().Get("busId")
	if busID == "" {
		http.Error(w, "Missing 'busId' query param", http.StatusBadRequest)
		return
	}

	channel := "bus:" + busID
	pubsub := redisClient.Subscribe(ctx, channel)
	defer pubsub.Close()

	// SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*") // For dev/testing

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	log.Printf("Client connected to %s via SSE", channel)
	msgChan := pubsub.Channel()

	// Keep connection alive ping
	go func() {
		for {
			_, ok := <-r.Context().Done()
			if !ok {
				return
			}
			return
		}
	}()

	for msg := range msgChan {
		fmt.Fprintf(w, "data: %s\n\n", msg.Payload)
		flusher.Flush()
	}
}

func main() {
	initRedis()
	http.HandleFunc("/location-stream", handleSSE)

	log.Println("SSE server running on :4000")
	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal("Server failed:", err)
	}
}
