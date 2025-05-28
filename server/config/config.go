package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type Config struct {
	Env              string
	ServerPort       string
	DBUrl            string
	RedisAddr        string
	RedisPass        string
	RedisConnectionStr string
	ServerSalt       string
	EncryptionKey    string
	SecretKey        []byte
	RefreshSecretKey []byte
	GoogleClientID   string
	GoogleClientSecret string
	GoogleRedirectURL string
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
		RedisConnectionStr: getEnv("REDIS_CONNECTION_STRING", "redis://localhost:6379"),
		ServerSalt:       getEnv("SERVER_SALT", "fallback-secret"),
		EncryptionKey:    getEnv("ENCRYPTION_KEY", ""),
		SecretKey:        []byte (getEnv("SECRET_KEY", "secret-key")),
		RefreshSecretKey: []byte(getEnv("REFRESH_SECRET_KEY", "refresh-secret-key")),
		GoogleClientID:   getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL: getEnv("GOOGLE_REDIRECT_URL", "http://localhost:8080/api/v1/auth/google/callback"),
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
