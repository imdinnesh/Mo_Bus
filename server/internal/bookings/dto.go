package bookings

type CreateBookingsRequest struct {
	RouteID           uint `json:"route_id"`
	SourceStopID      uint `json:"source_stop_id"`
	DestinationStopID uint `json:"destination_stop_id"`
}

type CreateBookingsResponse struct {
	BookingID uint `json:"booking_id"`
	Message  string `json:"message"`
	Status   string `json:"status"`
}
