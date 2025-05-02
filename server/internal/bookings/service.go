package bookings

import (
	"time"
	"net/http"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	CreateBookings(userID uint,req *CreateBookingsRequest) (*CreateBookingsResponse, error)
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

	if err := s.repo.CreateBooking(bookings); err != nil {
		return nil,apierror.New("failed to create booking", http.StatusInternalServerError)
	}

	return &CreateBookingsResponse{
		BookingID: bookings.ID,
		Message:  "Booking created successfully",
		Status:   "success",
	}, nil
}
	