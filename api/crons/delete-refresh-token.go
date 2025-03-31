package crons

import (
	"github/imdinnes/mobusapi/database"
	"log"
	"time"
	"gorm.io/gorm"
)


func DeleteExpiredRefreshTokens(db *gorm.DB) {
	refreshTokens := []database.RefreshToken{}
	expiryTime := time.Now().Add(-24 * time.Hour)
	db.Where("expires_at < ?", expiryTime).Find(&refreshTokens)

	for _, token := range refreshTokens {
		db.Delete(&token)
	}
	log.Println("Expired refresh tokens deleted")
}

