package trip

type GetRoutesByStopsRequest struct {
	SourceId      uint `json:"source_id"`
	DestinationId uint `json:"destination_id"`
}

type Route struct {
	ID          uint   `json:"id"`
	RouteNumber string `json:"route_number"`
	RouteName   string `json:"route_name"`
	Direction   uint   `json:"direction"`
}

type GetRoutesByStopsResponse struct {
	Status  string  `json:"status"`
	Message string  `json:"message"`
	Routes  []Route `json:"routes"`
}
