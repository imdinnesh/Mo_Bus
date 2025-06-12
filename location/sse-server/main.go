package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"strconv"

	"github.com/go-redis/redis/v8"
)

var (
	ctx         = context.Background()
	redisClient *redis.Client
)

// corsMiddleware adds the necessary CORS headers to requests.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set the allowed origin. For production, change this to your actual frontend domain.
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		// THIS IS THE NEW LINE YOU NEED TO ADD
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Call the next handler
		next.ServeHTTP(w, r)
	})
}


func initRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})
	if err := redisClient.Ping(ctx).Err(); err != nil {
		log.Fatal("Redis connection failed:", err)
	}
	log.Println("Redis connection successful")
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

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	// Note: The Access-Control-Allow-Origin header is now handled by the middleware

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	log.Printf("Client connected to %s via SSE", channel)
	
	// The client's context will be used to detect when the client has disconnected.
	clientCtx := r.Context()
	msgChan := pubsub.Channel()

	for {
		select {
		case <-clientCtx.Done():
			log.Printf("Client for %s disconnected", channel)
			return
		case msg := <-msgChan:
			fmt.Fprintf(w, "data: %s\n\n", msg.Payload)
			flusher.Flush()
		}
	}
}

func handleNearbyBuses(w http.ResponseWriter, r *http.Request) {
	latParam := r.URL.Query().Get("lat")
	// Corrected parameter name to 'lon' to match frontend expectations
	lonParam := r.URL.Query().Get("lon") 
	radiusParam := r.URL.Query().Get("radius")

	if latParam == "" || lonParam == "" || radiusParam == "" {
		http.Error(w, "lat, lon, and radius are required", http.StatusBadRequest)
		return
	}

	lat, err1 := strconv.ParseFloat(latParam, 64)
	lon, err2 := strconv.ParseFloat(lonParam, 64)
	radius, err3 := strconv.ParseFloat(radiusParam, 64)

	if err1 != nil || err2 != nil || err3 != nil {
		http.Error(w, "Invalid numeric parameters", http.StatusBadRequest)
		return
	}

	var nearbyBuses []map[string]interface{}

	iter := redisClient.Scan(ctx, 0, "bus:*", 0).Iterator()
	for iter.Next(ctx) {
		key := iter.Val()
		busData, err := redisClient.HGetAll(ctx, key).Result()
		if err != nil || len(busData) == 0 {
			continue
		}

		busLat, errLat := strconv.ParseFloat(busData["latitude"], 64)
		busLon, errLon := strconv.ParseFloat(busData["longitude"], 64)
		if errLat != nil || errLon != nil {
			continue // Skip if bus location data is invalid
		}
		
		distance := haversine(lat, lon, busLat, busLon)

		if distance <= radius {
			nearbyBuses = append(nearbyBuses, map[string]interface{}{
				"busId":     key[4:], // trim "bus:"
				"routeId":   busData["routeId"],
				"latitude":  busLat,
				"longitude": busLon,
				"timestamp": busData["timestamp"],
				"distance":  distance,
			})
		}
	}
    if err := iter.Err(); err != nil {
        log.Printf("Redis SCAN iterator error: %v", err)
        http.Error(w, "Internal server error", http.StatusInternalServerError)
        return
    }

	w.Header().Set("Content-Type", "application/json")
	// Note: The Access-Control-Allow-Origin header is now handled by the middleware
	json.NewEncoder(w).Encode(nearbyBuses)
}

func haversine(lat1, lon1, lat2, lon2 float64) float64 {
	const R = 6371 // Earth radius in KM
	dLat := (lat2 - lat1) * math.Pi / 180
	dLon := (lon2 - lon1) * math.Pi / 180
	lat1_rad := lat1 * math.Pi / 180
	lat2_rad := lat2 * math.Pi / 180

	a := math.Sin(dLat/2)*math.Sin(dLat/2) +
		math.Sin(dLon/2)*math.Sin(dLon/2)*math.Cos(lat1_rad)*math.Cos(lat2_rad)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))
	return R * c
}

func main() {
	initRedis()

	// Create a new ServeMux (router)
	mux := http.NewServeMux()

	// Define your handlers
	mux.HandleFunc("/location-stream", handleSSE)
	mux.HandleFunc("/buses/nearby", handleNearbyBuses)

	// Apply the CORS middleware to all routes in the mux
	handler := corsMiddleware(mux)

	log.Println("Server running on :4000")
	if err := http.ListenAndServe(":4000", handler); err != nil {
		log.Fatal("Server failed:", err)
	}
}