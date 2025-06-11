package database

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.User{},
		&models.RefreshToken{},
		&models.Route{},
		&models.RouteStop{},
		&models.Stop{},
		&models.Transaction{},
		&models.Booking{},
		&models.QrCode{},
		&models.Bus{},
	)
}
