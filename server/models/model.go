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