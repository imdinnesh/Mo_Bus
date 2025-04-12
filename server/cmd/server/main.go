package main

import (
	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/database"
	"github.com/imdinnesh/mobusapi/redis"
	"github.com/imdinnesh/mobusapi/router"
)

func main(){
	cfg:=config.Load()
	db:=database.SetupDatabase(cfg)
	redis.InitRedis(cfg)
	r := router.New(cfg, db)
    r.Run(":" + cfg.ServerPort)


}

