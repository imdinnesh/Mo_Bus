package routestop


import (
	
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	ValidRouteId(routeID uint) (bool, error)
	ValidStopId(stopID uint) (bool, error)
	CreateRouteStop(routeStop *AddRouteStopRequest) error
	UpdateRouteStop(routeStopID string,stopIndex uint) error
	DeleteRouteStop(routeStopID string) error
	ValidRouteStop(routeStopID string) (bool, error)
	ViewRouteStops(routeID uint) ([]models.RouteStop, error)
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

func (r *repository) UpdateRouteStop(routeStopID string,stopIndex uint) error {
	// We can change the index only
	err := r.db.Model(&models.RouteStop{}).Where("id = ?", routeStopID).Update("stop_index", stopIndex).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) DeleteRouteStop(routeStopID string) error {
	err := r.db.Where("id = ?", routeStopID).Delete(&models.RouteStop{}).Error
	if err != nil {
		return err
	}
	return nil

}

func (r *repository) ValidRouteStop(routeStopID string) (bool, error) {
	routeStop := &models.RouteStop{}
	err := r.db.Model(&models.RouteStop{}).Where("id = ?", routeStopID).First(routeStop).Error
	if err != nil {
		return false, err
	}
	return true, nil
}

func (r *repository) ViewRouteStops(routeID uint) ([]models.RouteStop, error) {
	var routeStops []models.RouteStop
	err := r.db.Model(&models.RouteStop{}).Preload("Route").Preload("Stop").Where("route_id = ?", routeID).Find(&routeStops).Error
	if err != nil {
		return nil, err
	}
	return routeStops, nil
}










