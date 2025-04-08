package database

import (
	"log"
	"github.com/imdinnesh/mobusapi/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase(cfg *config.Config) *gorm.DB {
	
	connStr:=cfg.DBUrl
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	AutoMigrate(db)
	

	return db

}

