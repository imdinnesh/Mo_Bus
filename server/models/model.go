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