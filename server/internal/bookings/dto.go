package bookings

import "time"

type CreateBookingsRequest struct {
	RouteID           uint `json:"route_id"`
	SourceStopID      uint `json:"source_stop_id"`
	DestinationStopID uint `json:"destination_stop_id"`
}

type CreateBookingsResponse struct {
	BookingID uint   `json:"booking_id"`
	Message   string `json:"message"`
	Status    string `json:"status"`
}

type GetBookingsResponse struct {
	ID                  uint      `json:"id"`
	RouteNumber         string    `json:"route_number"`
	RouteName           string    `json:"route_name"`
	SourceStopName      string    `json:"source_stop_name"`
	DestinationStopName string    `json:"destination_stop_name"`
	BookingDate         time.Time `json:"booking_date"`
	Amount              float64   `json:"amount"`
}
