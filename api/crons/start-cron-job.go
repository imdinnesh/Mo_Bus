package crons

import (
	"log"
	"github.com/robfig/cron/v3"
	"gorm.io/gorm"
)

func StartCronJobs(db *gorm.DB) {
	c:= cron.New()
	_, err := c.AddFunc("@daily", func() {
		DeleteExpiredRefreshTokens(db)
		log.Println("Cron job executed to delete expired refresh tokens")
	})
	if err != nil {
		log.Fatal("Error adding cron job:", err)
	}
	c.Start()
	log.Println("Cron job started to delete expired refresh tokens")
}