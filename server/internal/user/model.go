package user

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