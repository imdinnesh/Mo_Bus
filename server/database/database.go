package database

import (
	"log"
	"time"
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)

func SetupDatabase() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connStr := os.Getenv("DATABASE_URL")

	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate models
	db.AutoMigrate(&User{}, &Stop{}, &Route{}, &RouteStop{}, &Booking{}, &Payment{}, &Ticket{}, &QRCode{})
	return db
}

// Users Table
type User struct {
	ID       uint    `gorm:"primaryKey" json:"id"`
	Name   string  `json:"name"`
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Balance  float64 `json:"balance"`
}

// Stops Table
type Stop struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	StopName string `json:"stop_name"`
}

// Routes Table
type Route struct {
	ID                uint        `gorm:"primaryKey" json:"id"`
	RouteNumber       string      `json:"route_number"`
	RouteName         string      `json:"route_name"`
	SourceStopID      uint        `json:"source_stop_id"`
	DestinationStopID uint        `json:"destination_stop_id"`
	SourceStop        Stop        `gorm:"foreignKey:SourceStopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	DestinationStop   Stop        `gorm:"foreignKey:DestinationStopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	RouteStops        []RouteStop `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Route Stops Table (Maps Stops to Routes)
type RouteStop struct {
	ID      uint `gorm:"primaryKey" json:"id"`
	RouteID uint `json:"route_id"`
	StopID  uint `json:"stop_id"`
	Route   Route `gorm:"foreignKey:RouteID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Stop    Stop  `gorm:"foreignKey:StopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Bookings Table
type Booking struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `json:"user_id"`
	StartStopID uint      `json:"start_stop_id"`
	EndStopID   uint      `json:"end_stop_id"`
	Amount      float64   `json:"amount"`
	Status      string    `json:"status"` // enum: pending, success, failed
	BookingDate time.Time `json:"booking_date"`

	User      User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	StartStop Stop `gorm:"foreignKey:StartStopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
	EndStop   Stop `gorm:"foreignKey:EndStopID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

// Payments Table
type Payment struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	UserID          uint      `json:"user_id"`
	BookingID       uint      `json:"booking_id"`
	Amount          float64   `json:"amount"`
	Status          string    `json:"status"` // enum: pending, success, failed
	TransactionDate time.Time `json:"transaction_date"`

	User    User    `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Booking Booking `gorm:"foreignKey:BookingID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Tickets Table
type Ticket struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserID         uint      `json:"user_id"`
	BookingID      uint      `json:"booking_id"`
	GeneratedStatus bool      `json:"gen_status"` // generated or not generated
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`

	User    User    `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Booking Booking `gorm:"foreignKey:BookingID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// QRCode Table
type QRCode struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserID         uint      `json:"user_id"`
	TicketID       uint      `json:"ticket_id"`
	QRCodeData     string    `json:"qrcode"`
	VerifiedStatus bool      `json:"status"` // enum Verified, NotVerified
	ExpiryTime     time.Time `json:"expiry_time"`
	CreatedAt      time.Time `gorm:"autoCreateTime" json:"created_at"`

	User   User   `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Ticket Ticket `gorm:"foreignKey:TicketID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
