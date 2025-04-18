package routestop


import (
	
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	ValidRouteId(routeID uint) (bool, error)
	ValidStopId(stopID uint) (bool, error)
	CreateRouteStop(routeStop *AddRouteStopRequest) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) ValidRouteId(routeID uint) (bool, error) {
	route := &models.Route{}
	err := r.db.Model(&models.Route{}).Where("id = ?", routeID).First(route).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *repository) ValidStopId(stopID uint) (bool, error) {
	stop := &models.Stop{}
	err := r.db.Model(&models.Stop{}).Where("id = ?", stopID).First(stop).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *repository) CreateRouteStop(routeStop *AddRouteStopRequest) error {

	routeStopModel := &models.RouteStop{
		RouteID:   routeStop.RouteId,
		StopID:    routeStop.StopId,
		StopIndex: routeStop.StopIndex,
	}

	err := r.db.Create(routeStopModel).Error
	if err != nil {
		return err
	}
	return nil
}









