package bookings

import (
	"time"

	"github.com/imdinnesh/mobusapi/internal/user"
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	CreateBooking(booking *models.Booking) (uint, error)
	GetBookings(userID uint) ([]models.Booking, error)
	GetBooking(bookingID string,userID uint) (*models.Booking, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) CreateBooking(booking *models.Booking) (uint, error) {
	tx := r.db.Begin()
	defer tx.Rollback()

	if err := tx.Create(booking).Error; err != nil {
		return 0, err
	}

	transaction := models.Transaction{
		UserID:    booking.UserID,
		Amount:    booking.Amount,
		Status:    "success",
		Type:      "debit",
		CreatedAt: time.Now(),
	}

	if err := tx.Create(&transaction).Error; err != nil {
		return 0, err
	}

	user, err := user.NewRepository(r.db).FindById(booking.UserID)
	if err != nil {
		return 0, err
	}

	user.Balance -= booking.Amount
	if err := tx.Save(user).Error; err != nil {
		return 0, err
	}
	return booking.ID, tx.Commit().Error
}

func (r *repository) GetBookings(userID uint) ([]models.Booking, error) {
	bookings := []models.Booking{}

	err := r.db.Preload("SourceStop").
		Preload("DestinationStop").
		Preload("Route").
		Where("user_id = ?", userID).
		Find(&bookings).Error

	if err != nil {
		return nil, err
	}

	return bookings, nil

}

func (r *repository) GetBooking(bookingID string,userID uint) (*models.Booking, error) {

	booking := &models.Booking{}
	err := r.db.Preload("SourceStop").
			Preload("DestinationStop").
			Preload("Route").
			Where("user_id = ?", userID).
			Where("id = ?", bookingID).
			First(&booking).Error

	if err != nil {
		return nil, err
	}

	return booking, nil
}

