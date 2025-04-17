package routestop
type AddRouteStopRequest struct {
	RouteId uint `json:"route_id" validate:"required"`
	StopId uint `json:"stop_id" validate:"required"`
	StopIndex uint `json:"stop_index" validate:"required"`
}

type AddRouteStopResponse struct {
	Status string `json:"status"`
	Message string `json:"message"`
}

