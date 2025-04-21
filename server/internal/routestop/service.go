package routestop

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	AddRouteStop(routeStop *AddRouteStopRequest) (*AddRouteStopResponse,error)
	
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) AddRouteStop(routeStop *AddRouteStopRequest) (*AddRouteStopResponse,error) {
	validRouteId,err:=s.repo.ValidRouteId(routeStop.RouteId)
	if err!=nil{
		return nil,apierror.New("Invalid Route ID",http.StatusBadRequest)
	}

	if !validRouteId {
		return nil,apierror.New("Invalid Route ID",http.StatusBadRequest)
	}

	validStopId,err:=s.repo.ValidStopId(routeStop.StopId)
	if err!=nil{
		return nil,apierror.New("Invalid Stop ID",http.StatusBadRequest)
	}
	if !validStopId {
		return nil,apierror.New("Invalid Stop ID",http.StatusBadRequest)
	}

	err=s.repo.CreateRouteStop(routeStop)

	if err!=nil{
		return nil,apierror.New("Failed to add route stop",http.StatusInternalServerError)
	}

	return &AddRouteStopResponse{
		Status: "success",
		Message: "Route stop added successfully",
	},nil			
}

