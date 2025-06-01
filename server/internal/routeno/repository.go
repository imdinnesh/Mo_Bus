package routeno

import (	
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	GetRoutes() ([]models.Route, error)
	GetRouteById(id string) (*models.Route, error)
	AddRoute(route *models.Route) error
	UpdateRoute(userId string,route *UpdateRouteRequest) error
	DeleteRoute(id string) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) AddRoute(route *models.Route) error {
	err := r.db.Create(route).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) GetRoutes() ([]models.Route, error) {
	routes:=[]models.Route{}
	err:=r.db.Model(&models.Route{}).Find(&routes).Error
	if err != nil {
		return nil, err
	}
	return routes, nil
}

func (r *repository) GetRouteById(id string) (*models.Route, error) {
	route := &models.Route{}
	err:=r.db.Preload("RouteStops").Preload("RouteStops.Stop").Where("id = ?", id).First(&route).Error
	if err != nil {
		return nil, err
	}
	return route, nil
}

func (r *repository) UpdateRoute(id string,route *UpdateRouteRequest) error {
	err := r.db.Model(&models.Route{}).Where("id = ?", id).Updates(models.Route{
		RouteNumber: route.RouteNumber,
		RouteName:   route.RouteName,
		Direction:   route.Direction,
	}).Error
	if err != nil {
		return err
	}
	return nil
}

func (r *repository) DeleteRoute(id string) error {
	err := r.db.Where("id = ?", id).Delete(&models.Route{}).Error
	if err != nil {
		return err
	}
	return nil
}
 