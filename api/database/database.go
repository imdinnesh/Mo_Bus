package database

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase() *gorm.DB{

	connStr:="postgresql://postgres:postgres@localhost:5432/mobus_database?sslmode=disable&TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	db.AutoMigrate(&User{}, &Stop{}, &Route{}, &RouteStop{}, &RefreshToken{})
	return db

}
// User Table
type User struct{
	ID uint `gorm:"primaryKey" json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	Balance float64 `json:"balance"`
}

// Stops Table
type Stop struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	StopName string `json:"stop_name"`
}

// Routes Table
type Route struct {
	ID          uint        `gorm:"primaryKey" json:"id"`
	RouteNumber string      `json:"route_number"`
	RouteName   string      `json:"route_name"`
	Direction   int         `json:"direction"` // 0 = Forward, 1 = Reverse
	RouteStops  []RouteStop `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Route Stops Table (Maps Stops to Routes with Order)
type RouteStop struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	RouteID   uint `json:"route_id"`
	StopID    uint `json:"stop_id"`
	StopIndex int  `json:"stop_index"` // Order of stops in the route

	Route Route `gorm:"foreignKey:RouteID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Stop  Stop  `gorm:"foreignKey:StopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}


// RefreshToken model
type RefreshToken struct {
	ID           uint   `gorm:"primaryKey"`
	UserID       uint   `gorm:"index"`
	User User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EncryptedRefreshToken string
	ExpiresAt time.Time 
	DeviceID  string
}

