package bus

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	AddBusToRoute(req *AddBusRequest) (models.Bus, error)
	FindRouteByID(routeID uint) (bool, error)
	GetBusByRouteId(routeID uint) ([]models.Bus, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) AddBusToRoute(req *AddBusRequest) (models.Bus, error) {
	bus := models.Bus{
		BusNumber:    req.BusNumber,
		RouteID:      req.RouteID,
		IsActive:     req.IsActive,
		LicencePlate: req.LicencePlate,
	}
	err := r.db.Create(&bus).Error
	if err != nil {
		return models.Bus{}, err
	}
	return bus, nil
}

func (r *repository) FindRouteByID(routeID uint) (bool, error) {
	route := models.Route{}
	err := r.db.First(&route, routeID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

func (r *repository) GetBusByRouteId(routeID uint) ([]models.Bus, error) {
	buses := []models.Bus{}
	err := r.db.Where("route_id = ?", routeID).Find(&buses).Error
	if err != nil {
		return nil, err
	}
	return buses, nil
}
