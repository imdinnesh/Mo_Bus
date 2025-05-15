package qrcode

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
	"github.com/imdinnesh/mobusapi/redis"
	"fmt"
	"strings"
	"time"
)

type Service interface {
	StartTrip(userID uint, req *StartTripRequest) (*StartTripResponse, error)
	GenerateQRCode(userID uint,sessionKey string) (*GenerateQRCodeResponse, error)
	VerifyQRCode(request *VerifyQrCodeRequest) (*VerifyQrCodeResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) StartTrip(userID uint, req *StartTripRequest) (*StartTripResponse, error) {
	booking, err := s.repo.FindBookingsByID(req.BookingID)
	if err != nil {
		return nil, apierror.New("Invalid booking ID", http.StatusBadRequest)
	}
	if booking.UserID != userID {
		return nil, apierror.New("Invalid booking ID", http.StatusBadRequest)
	}

	if booking.IsGenerated {
		return nil, apierror.New("Trip already started", http.StatusBadRequest)
	}

	sessionKey, err := redis.CreateSession(userID, req.BookingID, req.RouteID, req.Source, req.Destination)
	if err != nil {
		return nil, apierror.New("Failed to create session", http.StatusInternalServerError)
	}

	// update the booking status
	booking.IsGenerated = true
	if err := s.repo.SaveBookingStatus(booking); err != nil {
		return nil, apierror.New("Failed to update booking status", http.StatusInternalServerError)
	}
	// create qr code entry
	qrCode := &models.QrCode{
		UserID:    userID,
		BookingID: req.BookingID,
		Used:      false,
	}
	if err:=s.repo.CreateQrCode(qrCode); err != nil {
		return nil, apierror.New("Failed to create QR code", http.StatusInternalServerError)
	}
	return &StartTripResponse{
		SessionKey: sessionKey,
		Message:  "Trip started successfully",
		Status: "Success",
	}, nil

}

func (s *service) GenerateQRCode(userID uint, sessionKey string) (*GenerateQRCodeResponse, error) {
	userIDStr := fmt.Sprintf("%d", userID)
	// session key is in the format "trip:userId:BookingId"
	bookingID := strings.Split(sessionKey, ":")[2]
	// Validate session key
	routeID, source, destination, err := redis.ValidatesSession(sessionKey)
	if err != nil {
		return nil, apierror.New("Invalid session key", http.StatusBadRequest)
	}
	qrCode, err := redis.GenerateQRCode(userIDStr, routeID, source, destination, bookingID)
	if err != nil {
		return nil, apierror.New("Failed to generate QR code", http.StatusInternalServerError)
	}
	return &GenerateQRCodeResponse{
		QRCode: qrCode,
		Message: "QR code generated successfully",
		Status:  "Success",
	}, nil

}

func (s *service) VerifyQRCode(request *VerifyQrCodeRequest) (*VerifyQrCodeResponse, error) {
	err:= redis.VerifyQRCode(request.UserID, request.RouteID, request.Source, request.Destination, request.OTP)
	if err != nil {
		return nil, apierror.New("Invalid QR code", http.StatusBadRequest)
	}
	qrCode,err:=s.repo.FindQrCodeByBookingID(request.BookingID)
	if err != nil {
		return nil, apierror.New("Invalid QR code", http.StatusBadRequest)
	}
	if qrCode.Used {
		return nil, apierror.New("QR code already used", http.StatusBadRequest)
	}

	qrCode.Used = true
	qrCode.UsedAt = time.Now()

	if err:=s.repo.SaveQrCode(qrCode); err != nil {
		return nil, apierror.New("Failed to update QR code", http.StatusInternalServerError)
	}
	return &VerifyQrCodeResponse{
		Message: "QR code verified successfully",
		Status:  "Success",
	}, nil
}



