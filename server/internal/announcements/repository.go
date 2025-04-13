package announcements

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	Create(announcement *models.Accouncements) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) Create(announcement *models.Accouncements) error {
	return r.db.Create(announcement).Error
}

