package main

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/database"
	"github.com/imdinnesh/mobusapi/routes"
)

func main(){
	cfg:=config.Load()
	db:=database.SetupDatabase(cfg)
	r:=gin.Default()
	api:=r.Group("/api/v1")
	routes.RegisterRoutes(api,db)
	r.Run(":"+cfg.ServerPort)


}

