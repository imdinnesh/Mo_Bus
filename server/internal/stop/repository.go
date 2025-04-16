package stop

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	AddStop(stop *models.Stop) error
	UpdateStop(id string,req *UpdateStopRequest) error
	DeleteStop(id string,) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) AddStop(stop *models.Stop) error {
	return r.db.Create(stop).Error
}

func (r *repository) UpdateStop(id string,req *UpdateStopRequest) error {
	stop := &models.Stop{}
	if err := r.db.Where("id = ?", id).First(stop).Error; err != nil {
		return err
	}
	stop.StopName = req.StopName
	return r.db.Save(stop).Error
	
}

func (r *repository) DeleteStop(id string) error {
	stop := &models.Stop{}
	if err := r.db.Where("id = ?", id).First(stop).Error; err != nil {
		return err
	}
	return r.db.Delete(stop).Error
}



