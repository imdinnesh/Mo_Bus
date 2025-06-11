package models

import "time"

type User struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	Name           string  `json:"name"`
	Email          string  `json:"email"`
	Password       string  `json:"password"`
	Balance        float64 `json:"balance"`
	Role           string  `json:"role"` // "user" or "admin"
	VerifiedStatus bool    `json:"verified_status" gorm:"default:false"`
	MobileNumber   string  `json:"mobile_number"`
	Gender         string  `json:"gender"`
}

type RefreshToken struct {
	ID                    uint `gorm:"primaryKey"`
	UserID                uint `gorm:"index"`
	User                  User `gorm:"foreignKey:UserID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EncryptedRefreshToken string
	ExpiresAt             time.Time
	DeviceID              string
}

type Accouncements struct{
	ID uint `gorm:"primaryKey" json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
	CreatedAt time.Time `json:"created_at"`
	Type string `json:"type"` // "general" or "emergency"
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
	ID                uint      `gorm:"primaryKey" json:"id"`
	UserID            uint      `json:"user_id"`
	SourceStopID      uint      `json:"source_stop_id"`
	DestinationStopID uint      `json:"destination_stop_id"`
	RouteID           uint      `json:"route_id"`
	BookingDate       time.Time `json:"booking_date"`
	Amount            float64   `json:"amount"`
	IsGenerated       bool      `json:"is_generated" gorm:"default:false"`
	SourceStop        Stop      `gorm:"foreignKey:SourceStopID;references:ID"`
	DestinationStop   Stop      `gorm:"foreignKey:DestinationStopID;references:ID"`
	Route             Route     `gorm:"foreignKey:RouteID;references:ID"`
}

// QrCode Table
type QrCode struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	BookingID uint      `json:"booking_id"`
	Used      bool      `json:"used" gorm:"default:false"` // true if the QR code has been used
	UsedAt    time.Time `json:"used_at"`
}

// Bus Table
type Bus struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	BusNumber  string    `json:"bus_number"` // Unique bus identifier like "BUS-101"
	RouteID    uint      `json:"route_id"`   // Foreign key to Route
	Route      Route     `gorm:"foreignKey:RouteID;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"route"`
	IsActive   bool      `json:"is_active" gorm:"default:true"` // If the bus is actively running on the route
	LicencePlate string    `json:"license_plate"` // Unique license plate number for the bus
}