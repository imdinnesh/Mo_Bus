package crons

import (
	"github/imdinnes/mobusapi/database"
	"log"
	"time"
	"gorm.io/gorm"
)


func DeleteExpiredOTP(db *gorm.DB) {
	otp := []database.OTP{}
	expiryTime := time.Now().Add(-1 * time.Hour)
	db.Where("expires_at < ?", expiryTime).Find(&otp)

	for _, token := range otp {
		db.Delete(&token)
	}
	log.Println("Expired otp tokens deleted")
}

