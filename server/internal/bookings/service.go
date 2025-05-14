package bookings

import (
	"net/http"
	"time"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	CreateBookings(userID uint,req *CreateBookingsRequest) (*CreateBookingsResponse, error)
	GetBookings(userID uint) ([]*GetBookingsResponse, error)
	GetBooking(bookingID string,userID uint) (*GetBookingsResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) CreateBookings(userID uint,req *CreateBookingsRequest) (*CreateBookingsResponse, error) {
	
	bookings:= &models.Booking{
		UserID:userID,
		RouteID: req.RouteID,
		SourceStopID: req.SourceStopID,
		DestinationStopID: req.DestinationStopID,
		BookingDate: time.Now(),
		Amount: 10,
	}

	bookingID, err := s.repo.CreateBooking(bookings)
	if err != nil {
		return nil, apierror.New("Failed to create booking", http.StatusInternalServerError)
	}

	return &CreateBookingsResponse{
		BookingID: bookingID,
		Message:  "Booking created successfully",
		Status:   "success",
	}, nil
}

func (s *service) GetBookings(userID uint) ([]*GetBookingsResponse, error) {
	bookings,err:=s.repo.GetBookings(userID)
	if err != nil {
		return nil, apierror.New("Failed to get bookings", http.StatusInternalServerError)
	}

	var bookingResponses []*GetBookingsResponse
	for _, booking := range bookings {
		bookingResponses = append(bookingResponses, &GetBookingsResponse{
			ID:                  booking.ID,
			RouteNumber:         booking.Route.RouteNumber,
			RouteName:           booking.Route.RouteName,
			SourceStopName:      booking.SourceStop.StopName,
			DestinationStopName: booking.DestinationStop.StopName,
			BookingDate:         booking.BookingDate,
			Amount:              booking.Amount,
		})
	}

	return bookingResponses, nil
}

func (s *service) GetBooking(bookingID string,userID uint) (*GetBookingsResponse, error) {
	booking, err := s.repo.GetBooking(bookingID,userID)
	if err != nil {
		return nil, apierror.New("Failed to get booking", http.StatusInternalServerError)
	}

	if booking == nil {
		return nil, apierror.New("Booking not found", http.StatusNotFound)
	}

	return &GetBookingsResponse{
		ID:                  booking.ID,
		RouteNumber:         booking.Route.RouteNumber,
		RouteName:           booking.Route.RouteName,
		SourceStopName:      booking.SourceStop.StopName,
		DestinationStopName: booking.DestinationStop.StopName,
		BookingDate:         booking.BookingDate,
		Amount:              booking.Amount,
	}, nil
}