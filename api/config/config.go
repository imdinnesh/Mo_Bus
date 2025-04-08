package config

import (
    "fmt"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    Env        string
    ServerPort string
    DBUrl      string
}

func Load() *Config {
    env := os.Getenv("ENV")
    if env == "" {
        env = "dev" // default to development
    }

    // Load env file based on the current environment
    _ = godotenv.Load(".env." + env)

    cfg := &Config{
        Env:        getEnv("ENV", "dev"),
        ServerPort: getEnv("SERVER_PORT", "8080"),
        DBUrl:      getEnv("DB_URL", ""),
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
