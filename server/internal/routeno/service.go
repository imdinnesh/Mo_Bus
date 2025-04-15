package routeno

import (
	"net/http"

	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	GetRoutes() (GetRoutesResponse, error)
	GetRouteById(id string) (GetRouteByIdResponse, error)
	AddRoute(route *AddRouteRequest) (AddRouteResponse, error)
	UpdateRoute(id string, route *UpdateRouteRequest) (UpdateRouteResponse,error)
	DeleteRoute(id string) (DeleteRouteResponse,error)

}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) GetRoutes() (GetRoutesResponse, error) {
	routes,err:=s.repo.GetRoutes()
	if err!=nil{
		return GetRoutesResponse{}, apierror.New("Failed to get routes", http.StatusInternalServerError)
	}

	response := GetRoutesResponse{
		Status:  "success",
		Message: "Routes fetched successfully",
		Routes:  routes,
	}
	return response, nil
}

func (s *service) GetRouteById(id string) (GetRouteByIdResponse, error) {
	route, err := s.repo.GetRouteById(id)
	if err != nil {
		return GetRouteByIdResponse{}, apierror.New("Route not found", http.StatusNotFound)
	}

	response := GetRouteByIdResponse{
		Status:  "success",
		Message: "Route fetched successfully",
		Route:   route,
	}
	return response, nil

}

func (s *service) AddRoute(route *AddRouteRequest) (AddRouteResponse, error) {
	routeModel:=&models.Route{
		RouteNumber: route.RouteNumber,
		RouteName:   route.RouteName,
		Direction:   route.Direction,

	}
	err:=s.repo.AddRoute(routeModel)

	if err!=nil{
		return AddRouteResponse{}, apierror.New("Failed to add route", http.StatusInternalServerError)
	}

	response := AddRouteResponse{
		Status:  "success",
		Message: "Route added successfully",
	}

	return response, nil

}

func (s *service) UpdateRoute(id string, route *UpdateRouteRequest) (UpdateRouteResponse,error) {
	err:=s.repo.UpdateRoute(id,route)
	if err!=nil{
		return UpdateRouteResponse{}, apierror.New("Failed to update route", http.StatusInternalServerError)
	}

	response := UpdateRouteResponse{
		Status:  "success",
		Message: "Route updated successfully",
	}
	return response,nil
}

func (s *service) DeleteRoute(id string) (DeleteRouteResponse,error) {
	err:=s.repo.DeleteRoute(id)
	if err!=nil{
		return DeleteRouteResponse{}, apierror.New("Failed to delete route", http.StatusInternalServerError)
	}

	response := DeleteRouteResponse{
		Status:  "success",
		Message: "Route deleted successfully",
	}
	return response,nil
}








	