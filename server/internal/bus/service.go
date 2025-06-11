package bus

import (
	"github.com/imdinnesh/mobusapi/pkg/apierror"
	"net/http"
)

type Service interface {
	AddBusToRoute(req *AddBusRequest) (*AddBusResponse, error)
	GetBusByRouteId(routeId uint) (*GetBusByRouteResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) AddBusToRoute(req *AddBusRequest) (*AddBusResponse, error) {
	routeId := req.RouteID

	present, err := s.repo.FindRouteByID(routeId)
	if err != nil {
		return nil, apierror.New("Failed to find route", http.StatusInternalServerError)
	}
	if !present {
		return nil, apierror.New("Route not found.", http.StatusNotFound)
	}
	_, err = s.repo.AddBusToRoute(req)
	if err != nil {
		return nil, apierror.New("Failed to add bus to route", http.StatusInternalServerError)
	}

	return &AddBusResponse{
		Status:  "success",
		Message: "Bus added to route successfully",
	}, nil
}

func (s *service) GetBusByRouteId(routeId uint) (*GetBusByRouteResponse, error) {
	present, err := s.repo.FindRouteByID(routeId)
	if err != nil {
		return nil, apierror.New("Failed to find route", http.StatusInternalServerError)
	}
	if !present {
		return nil, apierror.New("Route not found.", http.StatusNotFound)
	}
	buses, err := s.repo.GetBusByRouteId(routeId)
	if err != nil {
		return nil, apierror.New("Failed to get buses by route", http.StatusInternalServerError)
	}

	responseBuses := make([]Bus, 0, len(buses))
	for _, bus := range buses {
		responseBuses = append(responseBuses, Bus{
			ID:           bus.ID,
			BusNumber:    bus.BusNumber,
			LicencePlate: bus.LicencePlate,
		})
	}
	return &GetBusByRouteResponse{
		Status:  "success",
		Message: "Buses retrieved successfully",
		Buses:   responseBuses,
	}, nil
}
