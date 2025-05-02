package bookings

import (
	"time"

	"github.com/imdinnesh/mobusapi/internal/user"
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	CreateBooking(booking *models.Booking) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}


func (r *repository) CreateBooking(booking *models.Booking) error {
	tx := r.db.Begin()
	defer tx.Rollback()

	if err := tx.Create(booking).Error; err != nil {
		return err
	}

	transaction := models.Transaction{
		UserID: booking.UserID,
		Amount: booking.Amount,
		Status: "success",
		Type:   "debit",
		CreatedAt: time.Now(),
	}

	if err := tx.Create(&transaction).Error; err != nil {
		return err
	}

	user,err:=user.NewRepository(r.db).FindById(booking.UserID)
	if err != nil {
		return err
	}

	user.Balance -= booking.Amount
	if err := tx.Save(user).Error; err != nil {
		return err
	}
	return tx.Commit().Error
}
