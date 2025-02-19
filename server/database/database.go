package database

import (
    "log"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func SetupDatabase() *gorm.DB {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    db.AutoMigrate(&User{})
    return db
}

type User struct {
    ID       uint    `gorm:"primaryKey" json:"id"`
    Email    string  `json:"email"`
    Password string  `json:"password"`
    Balance  float64 `json:"balance"`
}