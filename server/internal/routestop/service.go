package routestop

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	AddRouteStop(routeStop *AddRouteStopRequest) (*AddRouteStopResponse,error)
	UpdateRouteStop(routeStopID string,request *UpdateRouteStopRequest) (*UpdateRouteStopResponse,error)
	DeleteRouteStop(routeStopID string) (*DeleteRouteStopResponse,error)
	ViewRouteStops(routeID uint) (*GetRouteStopsResponse, error)
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

func (s *service) UpdateRouteStop(routeStopID string,request *UpdateRouteStopRequest) (*UpdateRouteStopResponse,error) {
	validRouteStop,err:=s.repo.ValidRouteStop(routeStopID)
	if err!=nil{
		return nil,apierror.New("Invalid route stop ID",http.StatusBadRequest)
	}
	if !validRouteStop {
		return nil,apierror.New("Invalid route  stop ID",http.StatusBadRequest)
	}

	err=s.repo.UpdateRouteStop(routeStopID,request.StopIndex)
	if err!=nil{
		return nil,apierror.New("Failed to update route stop",http.StatusInternalServerError)
	}
	return &UpdateRouteStopResponse{
		Status: "success",
		Message: "Route stop updated successfully",
	},nil
}

func (s *service) DeleteRouteStop(routeStopID string) (*DeleteRouteStopResponse,error) {
	validStopId,err:=s.repo.ValidRouteStop(routeStopID)
	if err!=nil{
		return nil,apierror.New("Invalid route stop ID",http.StatusBadRequest)
	}
	if !validStopId {
		return nil,apierror.New("Invalid route stop ID",http.StatusBadRequest)
	}

	err=s.repo.DeleteRouteStop(routeStopID)
	if err!=nil{
		return nil,apierror.New("Failed to delete route stop",http.StatusInternalServerError)
	}
	return &DeleteRouteStopResponse{
		Status: "success",
		Message: "Route stop deleted successfully",
	},nil
}

func (s *service) ViewRouteStops(routeID uint) (*GetRouteStopsResponse, error) {
	validRouteId,err:=s.repo.ValidRouteId(routeID)
	if err!=nil{
		return nil,apierror.New("Invalid route ID",http.StatusBadRequest)
	}
	if !validRouteId {
		return nil,apierror.New("Invalid route ID",http.StatusBadRequest)
	}

	routeStops,err:=s.repo.ViewRouteStops(routeID)
	if err!=nil{
		return nil,apierror.New("Failed to view route stops",http.StatusInternalServerError)
	}

	if len(routeStops) == 0 {
		return &GetRouteStopsResponse{
			Status:  "success",
			Message: "No route stops found",
			RouteStops: []RouteStop{},
		},nil
	}

	response:= &GetRouteStopsResponse{
		RouteStops: make([]RouteStop, len(routeStops)),
	}

	for i, routeStop := range routeStops {
		response.RouteStops[i] = RouteStop{
			ID:        routeStop.ID,
			RouteID:   routeStop.RouteID,
			StopID:    routeStop.StopID,
			StopIndex: routeStop.StopIndex,
			Stop: Stop{
				ID:       routeStop.Stop.ID,
				StopName: routeStop.Stop.StopName,
			},
		}
	}

	return &GetRouteStopsResponse{
		Status: "success",
		Message: "Route stops retrieved successfully",
		RouteStops: response.RouteStops,
	},nil
}






