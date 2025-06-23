package routestop

type AddRouteStopRequest struct {
	RouteId   uint `json:"route_id" validate:"required"`
	StopId    uint `json:"stop_id" validate:"required"`
	StopIndex uint `json:"stop_index" validate:"required"`
}

type AddRouteStopResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type UpdateRouteStopRequest struct {
	StopIndex uint `json:"stop_index" validate:"required"`
}
type UpdateRouteStopResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type DeleteRouteStopResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type Stop struct {
	ID       uint   `json:"id"`
	StopName string `json:"stop_name"`
}

type RouteStop struct {
	ID        uint `json:"id"`
	RouteID   uint `json:"route_id"`
	StopID    uint `json:"stop_id"`
	StopIndex uint `json:"stop_index"`
	Stop      Stop `json:"stop"`
}

type GetRouteStopsResponse struct {
	Status      string      `json:"status"`
	Message     string      `json:"message"`
	RouteStops  []RouteStop `json:"route_stops"`
}
	