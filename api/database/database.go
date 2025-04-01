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
	// db.Exec("DELETE FROM users")
	// db.Exec("ALTER SEQUENCE users_id_seq RESTART WITH 1")

	db.AutoMigrate(&User{}, &Stop{}, &Route{}, &RouteStop{}, &RefreshToken{},&OTP{})
	return db

}
// User Table
type User struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	Name           string    `json:"name"`
	Email          string    `json:"email"`
	Password       string    `json:"password"`
	Balance        float64   `json:"balance"`
	Role           string    `json:"role"` // "user" or "admin"
	VerifiedStatus bool      `json:"verified_status" gorm:"default:false"`
	OTP            []OTP     `gorm:"foreignKey:UserID;references:ID" json:"otp"` // One-to-many relationship
}

// OTP Table
type OTP struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	OTP       string    `json:"otp"`
	Expiry    time.Time `json:"expiry"`
	UserID    uint      `json:"user_id"` // Foreign key to User
	User User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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
	Direction   uint         `json:"direction"` // 1 = Forward, 2 = Reverse
	RouteStops  []RouteStop `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Route Stops Table (Maps Stops to Routes with Order)
type RouteStop struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	RouteID   uint `json:"route_id"`
	StopID    uint `json:"stop_id"`
	StopIndex uint  `json:"stop_index"` // Order of stops in the route

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

