package auth

import (
	"github.com/imdinnesh/mobusapi/internal/auth/providers/google"
	"gorm.io/gorm"
)

type Service interface {
	GetGoogleLoginURL(deviceID string) string
	HandleGoogleCallback(code, deviceID string) (*google.OAuthResponse, error)
}

type service struct {
	googleProvider *google.GoogleProvider
}

func NewService(db *gorm.DB) Service {
	return &service{
		googleProvider: google.NewGoogleProvider(db),
	}
}

func (s *service) GetGoogleLoginURL(deviceID string) string {
	return s.googleProvider.GetLoginURL(deviceID)
}

func (s *service) HandleGoogleCallback(code, deviceID string) (*google.OAuthResponse, error) {
	return s.googleProvider.HandleCallback(code, deviceID)
}
