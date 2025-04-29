package payment

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
	"time"
)

type Repository interface {
	UpdateBalance(user *models.User, amount float64) error
	
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) UpdateBalance(user *models.User, amount float64) error {
	tx := r.db.Begin()
	defer tx.Rollback()

	user.Balance+=amount
	if err := tx.Save(user).Error; err != nil {
		return err 
	}

	transaction := models.Transaction{
		UserID:    user.ID,
		Amount:    amount,
		CreatedAt: time.Now(),
		Type:      "credit",
		Status:    "success",
	}

	if err := tx.Create(&transaction).Error; err != nil {
		return err
	}
	
	return tx.Commit().Error


}

