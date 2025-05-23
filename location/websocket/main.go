package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"math"

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

func handleNearbyBuses(w http.ResponseWriter, r *http.Request) {
	latParam := r.URL.Query().Get("lat")
	lngParam := r.URL.Query().Get("lng")
	radiusParam := r.URL.Query().Get("radius")

	if latParam == "" || lngParam == "" || radiusParam == "" {
		http.Error(w, "lat, lng, and radius are required", http.StatusBadRequest)
		return
	}

	lat, _ := strconv.ParseFloat(latParam, 64)
	lng, _ := strconv.ParseFloat(lngParam, 64)
	radius, _ := strconv.ParseFloat(radiusParam, 64)

	var nearbyBuses []map[string]interface{}

	iter := redisClient.Scan(ctx, 0, "bus:*", 0).Iterator()
	for iter.Next(ctx) {
		key := iter.Val()
		busData, err := redisClient.HGetAll(ctx, key).Result()
		if err != nil || len(busData) == 0 {
			continue
		}

		busLat, _ := strconv.ParseFloat(busData["latitude"], 64)
		busLng, _ := strconv.ParseFloat(busData["longitude"], 64)
		distance := haversine(lat, lng, busLat, busLng)

		if distance <= radius {
			nearbyBuses = append(nearbyBuses, map[string]interface{}{
				"busId":     key[4:], // trim "bus:"
				"routeId":   busData["routeId"],
				"latitude":  busLat,
				"longitude": busLng,
				"timestamp": busData["timestamp"],
				"distance":  distance,
			})
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(nearbyBuses)
}



func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth radius in KM
	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180
	lat1 = lat1 * math.Pi / 180
	lat2 = lat2 * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Sin(dLon/2)*math.Sin(dLon/2)*math.Cos(lat1)*math.Cos(lat2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

func main() {
	initRedis()
	http.HandleFunc("/location", handleWebSocket)
	http.HandleFunc("/buses/nearby", handleNearbyBuses)
	log.Println("WebSocket server running at :4000")
	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal("ListenAndServe failed:", err)
	}
}
