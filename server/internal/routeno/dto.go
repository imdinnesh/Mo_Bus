package routeno

import "github.com/imdinnesh/mobusapi/models"

type AddRouteRequest struct {
	RouteNumber string      `json:"route_number"`
	RouteName   string      `json:"route_name"`
	Direction   uint        `json:"direction"` // 1 = Forward, 2 = Reverse
}

type AddRouteResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`

}

type Routes struct{
	ID uint `json:"id"`
	RouteNumber string `json:"route_number"`
	RouteName string `json:"route_name"`
	Direction uint `json:"direction"` // 1 = Forward, 2 = Reverse
}

type GetRoutesResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`
	Routes []Routes `json:"routes"`
}

type GetRouteByIdResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`
	Route *models.Route `json:"route"`
}

type UpdateRouteRequest struct {
	RouteNumber string      `json:"route_number"`
	RouteName   string      `json:"route_name"`
	Direction   uint        `json:"direction"` // 1 = Forward, 2 = Reverse
}

type UpdateRouteResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

type DeleteRouteResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

