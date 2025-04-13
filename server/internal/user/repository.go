package user

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	Create(user *models.User) error
	FindByEmail(email string)(*models.User,error)
	Update(user *models.User) error
	SaveRefreshToken(token *models.RefreshToken) error
	FindById(id uint) (*models.User, error)
	DeleteRefreshToken(token *models.RefreshToken,userId uint,deviceId string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *repository) FindByEmail(email string) (*models.User, error) {
	user:=models.User{}
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *repository) SaveRefreshToken(token *models.RefreshToken) error {
	return r.db.Create(token).Error
}

func (r *repository) FindById(id uint) (*models.User, error) {
	user := models.User{}
	err := r.db.Where("id = ?", id).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *repository) DeleteRefreshToken(token *models.RefreshToken,userId uint,deviceId string) error {
	err := r.db.Where("user_id = ? AND device_id = ?", userId, deviceId).Delete(token).Error
	if err != nil {
		return err
	}
	return nil

}