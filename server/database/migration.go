package database

import (
	"github.com/imdinnesh/mobusapi/internal/user"
	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&user.User{},
	)
}
