package payment

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
	"time"
)

type Repository interface {
	FindById(id uint) (*models.User, error)
	UpdateBalance(user *models.User, amount float64) error
	GetTransactions(userId uint) ([]Transactions, error)	
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

func (r *repository) GetTransactions(userId uint) ([]Transactions, error) {
	transactions := make([]Transactions, 0)
	err := r.db.Model(&models.Transaction{}).
			Where("user_id = ?",userId).
			Order("created_at DESC").
			Select("id", "amount", "created_at", "type").
			Limit(10).
			Find(&transactions).Error

	if err != nil {
		return nil, err
	}

	return transactions, nil
}
