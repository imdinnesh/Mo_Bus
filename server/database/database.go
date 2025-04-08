package database

import (
	"log"
	"github.com/imdinnesh/mobusapi/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func SetupDatabase(cfg *config.Config) *gorm.DB {
	
	connStr:=cfg.DBUrl
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	DB = db
	AutoMigrate(db)
	return db

}

