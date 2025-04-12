package main

import (
	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/database"
	"github.com/imdinnesh/mobusapi/pkg/crypto"
	"github.com/imdinnesh/mobusapi/redis"
	"github.com/imdinnesh/mobusapi/router"
	"log"
)

func main(){
	cfg:=config.Load()
	if err := crypto.Init(cfg.EncryptionKey); err != nil {
		log.Fatalf("Failed to initialize crypto: %v", err)
	}
	db:=database.SetupDatabase(cfg)
	redis.InitRedis(cfg)
	r := router.New(cfg, db)
    r.Run(":" + cfg.ServerPort)
}

