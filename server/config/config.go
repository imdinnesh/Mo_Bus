package config

import (
	"fmt"
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	Env              string
	ServerPort       string
	DBUrl            string
	RedisAddr        string
	RedisPass        string
	ServerSalt       string
	SecretKey        string
	RefreshSecretKey string
	EncryptionKey    string
}

func Load() *Config {
	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	// Load corresponding .env file
	if err := godotenv.Load(".env." + env); err != nil {
		log.Printf("Warning: could not load .env.%s file: %v", env, err)
	}

	cfg := &Config{
		Env:              getEnv("ENV", "dev"),
		ServerPort:       getEnv("SERVER_PORT", "8080"),
		DBUrl:            getEnv("DB_URL", ""),
		RedisAddr:        getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPass:        getEnv("REDIS_PASSWORD", ""),
		ServerSalt:       getEnv("SERVER_SALT", "fallback-secret"),
		SecretKey:        getEnv("SECRET_KEY", "secret-key"),
		RefreshSecretKey: getEnv("REFRESH_SECRET_KEY", "refresh-secret-key"),
		EncryptionKey:    getEnv("ENCRYPTION_KEY", ""),
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
