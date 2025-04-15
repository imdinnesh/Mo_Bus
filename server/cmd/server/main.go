package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/constants"
	"github.com/imdinnesh/mobusapi/crons"
	"github.com/imdinnesh/mobusapi/database"
	"github.com/imdinnesh/mobusapi/pkg/crypto"
	"github.com/imdinnesh/mobusapi/redis"
	"github.com/imdinnesh/mobusapi/router"
)

func main() {
	cfg := config.Load()

	if err := crypto.Init(cfg.EncryptionKey); err != nil {
		log.Fatalf("Failed to initialize crypto: %v", err)
	}

	// Initialize database and Redis
	db := database.SetupDatabase(cfg)
	redis.InitRedis(cfg)

	// Start cron jobs
	crons.StartCronJobs(db)

	// Set up router (Gin)
	Router := router.New(cfg, db)

	// Create custom HTTP server
	srv := &http.Server{
		Addr:    ":" + cfg.ServerPort,
		Handler: Router,
	}

	// Signal handling for graceful shutdown
	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		log.Printf("Server is running on port %s", cfg.ServerPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	<-done // Wait for signal

	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), constants.ShutdownTimeout)
	defer cancel()

	// Graceful shutdown
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
	}

	log.Println("Server gracefully stopped")
}
