package trip

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	GetDirectRoutes(sourceID, destinationID uint) ([]models.Route, error)
}
type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) GetDirectRoutes(sourceID, destinationID uint) ([]models.Route, error) {
	routes,err:=s.repo.FindRoutesByStops(sourceID, destinationID)
	if err != nil {
		return nil, apierror.New("Failed to find routes by stops",http.StatusInternalServerError)
	}
	if len(routes) == 0 {
		return nil, apierror.New("No direct routes found", http.StatusNotFound)
	}
	return routes, nil
}

