package transactions

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindById(id uint) (*models.User, error)
	GetTransactions(userId uint) ([]models.Transaction, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindById(id uint) (*models.User, error) {
	user := models.User{}
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) GetTransactions(userId uint) ([]models.Transaction, error) {
	transactions := []models.Transaction{}
	err := r.db.
		Where("user_id = ?", userId).
		Order("created_at DESC").
		Find(&transactions).Error

	if err != nil {
		return nil, err
	}
	return transactions, nil
}
