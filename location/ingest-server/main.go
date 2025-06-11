package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"time"

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
	kafkaTopic = "gps-coordinates"
	kafkaAddr  = "localhost:9092"
)

var kafkaWriter *kafka.Writer

func createTopicIfNotExists(topic string) error {
	conn, err := kafka.Dial("tcp", kafkaAddr)
	if err != nil {
		return fmt.Errorf("failed to dial Kafka: %w", err)
	}
	defer conn.Close()

	controller, err := conn.Controller()
	if err != nil {
		return fmt.Errorf("failed to get controller: %w", err)
	}

	controllerConn, err := kafka.Dial("tcp", net.JoinHostPort(controller.Host, fmt.Sprintf("%d", controller.Port)))
	if err != nil {
		return fmt.Errorf("failed to connect to controller: %w", err)
	}
	defer controllerConn.Close()

	topicConfigs := []kafka.TopicConfig{
		{
			Topic:             topic,
			NumPartitions:     1,
			ReplicationFactor: 1,
		},
	}

	err = controllerConn.CreateTopics(topicConfigs...)
	if err != nil {
		return fmt.Errorf("failed to create topic: %w", err)
	}

	log.Printf("Kafka topic '%s' ensured.\n", topic)
	return nil
}

func initKafkaWriter() *kafka.Writer {
	return kafka.NewWriter(kafka.WriterConfig{
		Brokers:          []string{kafkaAddr},
		Topic:            kafkaTopic,
		Balancer:         &kafka.LeastBytes{},
		WriteTimeout:     10 * time.Second,
		ReadTimeout:      10 * time.Second,
	})
}

func gpsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var data GPSData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	log.Printf("Received: %+v\n", data)

	msgBytes, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Failed to marshal message", http.StatusInternalServerError)
		return
	}

	err = kafkaWriter.WriteMessages(context.Background(), kafka.Message{
		Key:   []byte(data.BusID),
		Value: msgBytes,
	})
	if err != nil {
		http.Error(w, "Failed to send to Kafka", http.StatusInternalServerError)
		log.Println("Kafka error:", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Message sent to Kafka"))
}

func main() {
	// Ensure topic exists
	if err := createTopicIfNotExists(kafkaTopic); err != nil {
		log.Fatalf("Failed to prepare Kafka topic: %v", err)
	}

	kafkaWriter = initKafkaWriter()
	defer kafkaWriter.Close()

	http.HandleFunc("/location", gpsHandler)

	log.Println("Ingest server listening on :3001")
	if err := http.ListenAndServe(":3001", nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
