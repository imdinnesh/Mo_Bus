package bus

type AddBusRequest struct {
	BusNumber    string `json:"bus_number" binding:"required"`
	RouteID      uint   `json:"route_id" binding:"required"`
	IsActive     bool   `json:"is_active"`
	LicencePlate string `json:"license_plate" binding:"required"`
}

type AddBusResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

type Bus struct {
	ID           uint   `json:"id"`
	BusNumber    string `json:"bus_number"`
	LicencePlate string `json:"license_plate"`
}

type GetBusByRouteResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Buses   []Bus  `json:"buses"`
}
