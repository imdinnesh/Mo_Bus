package database

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.RefreshToken{},
	)
}
