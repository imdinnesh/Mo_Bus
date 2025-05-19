package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// GPSData represents the incoming GPS data structure
type GPSData struct {
	BusID     string  `json:"busId"`
	RouteID   string  `json:"routeId"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Timestamp string  `json:"timestamp"`
}

func trackHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var data GPSData
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	// Log the received data
	log.Printf("Received GPS data: BusID=%s RouteID=%s Lat=%f Lon=%f Time=%s\n",
		data.BusID, data.RouteID, data.Latitude, data.Longitude, data.Timestamp)

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}

func main() {
	http.HandleFunc("/location", trackHandler)
	fmt.Println("Starting server on :3000")
	log.Fatal(http.ListenAndServe(":3000", nil))
}
