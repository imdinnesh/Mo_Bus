package main

import (
	"fmt"
	"github/imdinnes/mobusapi/config"
	"github/imdinnes/mobusapi/crons"
	"github/imdinnes/mobusapi/database"
	"github/imdinnes/mobusapi/internal/server"
)

func main() {
    cfg:=config.Load()
	db:=database.SetupDatabase(cfg)
    fmt.Println("Database connected")
    crons.StartCronJobs(db)
    r := server.New(cfg,db)
    r.Run(":" + cfg.ServerPort)
}
