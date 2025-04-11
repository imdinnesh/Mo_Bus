package database

import (
	"log"

	"github.com/imdinnesh/mobusapi/internal/user"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB){
	err:=db.AutoMigrate(
		&user.User{},
	)
	if err != nil {
		log.Fatal("Failed to auto migrate database:", err)
	}
	log.Println("Database migrated successfully")
}

