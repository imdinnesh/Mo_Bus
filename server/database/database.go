package database

import (
	"log"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func SetupDatabase() *gorm.DB {
	dsn := "host=localhost user=postgres password=postgres dbname=postgres port=5432 sslmode=disable TimeZone=Asia/Shanghai"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
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
	SourceStop        Stop        `gorm:"foreignKey:SourceStopID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	DestinationStop   Stop        `gorm:"foreignKey:DestinationStopID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	RouteStops        []RouteStop `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Route Stops Table (Maps Stops to Routes)
type RouteStop struct {
	ID      uint  `gorm:"primaryKey" json:"id"`
	RouteID uint  `json:"route_id"`
	StopID  uint  `json:"stop_id"`
	Route   Route `gorm:"foreignKey:RouteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Stop    Stop  `gorm:"foreignKey:StopID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
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

	User      User `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	StartStop Stop `gorm:"foreignKey:StartStopID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EndStop   Stop `gorm:"foreignKey:EndStopID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Payments Table
type Payment struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	UserID          uint      `json:"user_id"`
	BookingID       uint      `json:"booking_id"`
	Amount          float64   `json:"amount"`
	Status          string    `json:"status"` // enum: pending, success, failed
	TransactionDate time.Time `json:"transaction_date"`

	User    User    `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Booking Booking `gorm:"foreignKey:BookingID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

// Tickets Table
type Ticket struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	BookingID uint      `json:"booking_id"`
	Generated_Status    bool    `json:"gen_status"` // generated or not generated
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	Booking  Booking `gorm:"foreignKey:BookingID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

}
// QRCode Table
type QRCode struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	TicketID  uint      `json:"ticket_id"`
	QRCode    string    `json:"qrcode"`
	Status    string    `json:"status"` // enum Verified, NotVerified
	ExpiryTime time.Time `json:"expiry_time"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
	Ticket  Ticket `gorm:"foreignKey:TicketID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}


