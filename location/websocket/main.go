package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-redis/redis/v8"
	"github.com/gorilla/websocket"
)

var (
	ctx         = context.Background()
	redisClient *redis.Client
	upgrader    = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Allow all origins for dev
		},
	}
)

func initRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatal("Redis connection failed:", err)
	}
}

// handleWebSocket upgrades connection and subscribes to bus channel
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	busID := r.URL.Query().Get("busId")
	if busID == "" {
		http.Error(w, "busId query param required", http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	channel := "bus:" + busID
	pubsub := redisClient.Subscribe(ctx, channel)
	defer pubsub.Close()

	log.Printf("Client connected to %s\n", channel)

	ch := pubsub.Channel()

	for msg := range ch {
		err := conn.WriteMessage(websocket.TextMessage, []byte(msg.Payload))
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

func main() {
	initRedis()
	http.HandleFunc("/location", handleWebSocket)

	log.Println("WebSocket server running at :4000")
	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal("ListenAndServe failed:", err)
	}
}
