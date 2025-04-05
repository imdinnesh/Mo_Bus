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

	// // Delete all records (optional)
	// db.Exec("DELETE FROM users")

	// // Reset the sequence for the 'users' table
	// db.Exec("ALTER SEQUENCE users_id_seq RESTART WITH 1")

	db.AutoMigrate(&User{}, &Stop{}, &Route{}, &RouteStop{}, &RefreshToken{},&Transaction{},&Booking{},&QrCode{})
	return db

}
// User Table
type User struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	Password       string  `json:"password"`
	Balance        float64 `json:"balance"`
	Role           string  `json:"role"` // "user" or "admin"
	VerifiedStatus bool    `json:"verified_status" gorm:"default:false"`
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
	Direction   uint        `json:"direction"` // 1 = Forward, 2 = Reverse
	RouteStops  []RouteStop `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Route Stops Table (Maps Stops to Routes with Order)
type RouteStop struct {
	ID        uint `gorm:"primaryKey" json:"id"`
	RouteID   uint `json:"route_id"`
	StopID    uint `json:"stop_id"`
	StopIndex uint `json:"stop_index"` // Order of stops in the route

	Route Route `gorm:"foreignKey:RouteID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Stop  Stop  `gorm:"foreignKey:StopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// RefreshToken model
type RefreshToken struct {
	ID                  uint      `gorm:"primaryKey"`
	UserID              uint      `gorm:"index"`
	User                User      `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EncryptedRefreshToken string
	ExpiresAt           time.Time
	DeviceID            string
}

// Transactions Table
type Transaction struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	Amount    float64   `json:"amount"`
	Status    string    `json:"status"` // "success" or "failed" or "pending"
	CreatedAt time.Time `json:"created_at"`
	Type      string    `json:"type"` // "debit" or "credit"
	User      User      `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Bookings Table (UPDATED with associations)
type Booking struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	UserID             uint      `json:"user_id"`
	SourceStopID       uint      `json:"source_stop_id"`
	DestinationStopID  uint      `json:"destination_stop_id"`
	RouteID            uint      `json:"route_id"`
	BookingDate        time.Time `json:"booking_date"`
	Amount             float64   `json:"amount"`
	SourceStop         Stop      `gorm:"foreignKey:SourceStopID;references:ID"`
	DestinationStop    Stop      `gorm:"foreignKey:DestinationStopID;references:ID"`
	Route              Route     `gorm:"foreignKey:RouteID;references:ID"`
}

// QrCode Table
type QrCode struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	BookingID uint      `json:"booking_id"`
	QrCode    string    `json:"qr_code"`
	ExpiresAt time.Time `json:"expires_at"`
	Used      bool      `json:"used" gorm:"default:false"` // true if the QR code has been used
	UsedAt    time.Time `json:"used_at"`
}

