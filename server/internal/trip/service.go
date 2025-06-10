package trip

import (
	"github.com/imdinnesh/mobusapi/pkg/apierror"
	"net/http"
)

type Service interface {
	GetDirectRoutes(req *GetRoutesByStopsRequest) (*GetRoutesByStopsResponse, error)
}
type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) GetDirectRoutes(req *GetRoutesByStopsRequest) (*GetRoutesByStopsResponse, error) {
	routes, err := s.repo.FindRoutesByStops(req.SourceId, req.DestinationId)
	if err != nil {
		return nil, apierror.New("Failed to find routes by stops", http.StatusInternalServerError)
	}

	if len(routes) == 0 {
		return &GetRoutesByStopsResponse{
			Status:  "invalid",
			Message: "No direct routes found",
			Routes:  nil,
		}, nil
	}
	responseRoutes := make([]Route, 0, len(routes))
	for _, r := range routes {
		responseRoutes = append(responseRoutes, Route{
			ID:          r.ID,
			RouteNumber: r.RouteNumber,
			RouteName:   r.RouteName,
			Direction:   r.Direction,
		})
	}
	return &GetRoutesByStopsResponse{
		Status:  "success",
		Message: "Routes fetched successfully",
		Routes:  responseRoutes,
	}, nil
}
