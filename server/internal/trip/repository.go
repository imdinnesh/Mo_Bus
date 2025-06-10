package trip

import (
	"github.com/imdinnesh/mobusapi/models"
	"gorm.io/gorm"
)

type Repository interface {
	FindRoutesByStops(sourceID, destinationID uint) ([]models.Route, error)
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db}
}

func (r *repository) FindRoutesByStops(sourceID, destinationID uint) ([]models.Route, error) {
	var routes []models.Route

	subQuery := r.db.
		Table("route_stops as rs1").
		Select("rs1.route_id").
		Joins("JOIN route_stops as rs2 ON rs1.route_id = rs2.route_id").
		Where("rs1.stop_id = ? AND rs2.stop_id = ? AND rs1.stop_index < rs2.stop_index", sourceID, destinationID).
		Group("rs1.route_id")

	err := r.db.
		Table("routes").
		Where("id IN (?)", subQuery).
		Find(&routes).Error

	return routes, err
}
