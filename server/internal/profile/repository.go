package profile

import (
	
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetProfile(userID uint) (*models.User, error)
	UpdateProfile(userID uint, userDetails *UpdateUserDetailsRequest) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) GetProfile(userID uint) (*models.User, error) {
	user:=&models.User{}
	err := r.db.Model(&models.User{}).Where("id = ?", userID).First(user).Error
	if err != nil {
		return nil,err
		
	}
	return user, nil
}

func (r *repository) UpdateProfile(userID uint, userDetails *UpdateUserDetailsRequest) error{
	user:=&models.User{}

	return r.db.Model(&user).Where("id = ?", userID).Updates(models.User{
		Name:         userDetails.Name,
		Email:        userDetails.Email,
		MobileNumber: userDetails.MobileNumber,
		Gender: userDetails.Gender,
	}).Error
} 