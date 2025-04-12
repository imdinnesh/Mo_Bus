package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Env         string
	ServerPort  string
	DBUrl       string
	RedisAddr   string
	RedisPass   string
	ServerSalt  string
}

func Load() *Config {
	env := os.Getenv("ENV")
	if env == "" {
		env = "dev" // default to development
	}

	// Load env file like .env.dev, .env.prod etc.
	_ = godotenv.Load(".env." + env)

	cfg := &Config{
		Env:         getEnv("ENV", "dev"),
		ServerPort:  getEnv("SERVER_PORT", "8080"),
		DBUrl:       getEnv("DB_URL", ""),
		RedisAddr:   getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPass:   getEnv("REDIS_PASSWORD", ""),
		ServerSalt:  getEnv("SERVER_SALT", "fallback-secret"),
	}

	fmt.Println("Loaded environment:", cfg.Env)
	return cfg
}

func getEnv(key, defaultVal string) string {
	val := os.Getenv(key)
	if val == "" {
		return defaultVal
	}
	return val
}
