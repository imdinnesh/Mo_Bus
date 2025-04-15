package crons

import (
	"log"
	"time"
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

func DeleteaExpiredRefreshTokens(db *gorm.DB) {
	refreshTokens := []models.RefreshToken{}
	expiryTime := time.Now().Add(-24 * time.Hour)
	db.Where("expires_at < ?", expiryTime).Find(&refreshTokens)

	for _, token := range refreshTokens {
		db.Delete(&token)
	}
	log.Println("Expired refresh tokens deleted")
}
