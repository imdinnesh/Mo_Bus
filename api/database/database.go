package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

func SetupDatabase() *gorm.DB{

	connStr:="postgresql://postgres:postgres@localhost:5432/mobus_database?sslmode=disable&TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&User{})
	return db

}

type User struct{
	ID uint `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	Balance float64 `json:"balance"`
}



