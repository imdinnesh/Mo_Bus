package auth

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/imdinnesh/mobusapi/config"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/jwt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

type Service interface {
	GetGoogleLoginURL(deviceID string) string
	HandleGoogleCallback(code, deviceID string) (*OAuthResponse, error)
}

type service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) Service {
	return &service{db: db}
}

var googleOAuthConfig = &oauth2.Config{
	RedirectURL:  config.Load().GoogleRedirectURL,
	ClientID:   config.Load().GoogleClientID  ,
	ClientSecret: config.Load().GoogleClientSecret,
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
	Endpoint:     google.Endpoint,
}

type GoogleUser struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	ID    string `json:"id"`
}

type OAuthResponse struct {
	Status       string `json:"status"`
	Message      string `json:"message"`
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

func (s *service) GetGoogleLoginURL(deviceID string) string {
	state := deviceID // use more secure format if needed
	return googleOAuthConfig.AuthCodeURL(state)
}

func (s *service) HandleGoogleCallback(code, deviceID string) (*OAuthResponse, error) {
	token, err := googleOAuthConfig.Exchange(context.Background(), code)
	if err != nil {
		return nil, fmt.Errorf("token exchange failed: %w", err)
	}

	client := googleOAuthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		return nil, fmt.Errorf("failed to get userinfo: %w", err)
	}
	defer resp.Body.Close()

	var gUser GoogleUser
	err = json.NewDecoder(resp.Body).Decode(&gUser)
	if err != nil {
		return nil, fmt.Errorf("failed to decode user info: %w", err)
	}

	var user models.User
	dbErr := s.db.Where("email = ?", gUser.Email).First(&user).Error
	if dbErr == gorm.ErrRecordNotFound {
		user = models.User{
			Name:           gUser.Name,
			Email:          gUser.Email,
			VerifiedStatus: true,
			Role:           "user",
		}
		s.db.Create(&user)
	}
	// the third parameter is the device ID
	// in this case, oauth is to be replaced with the actual device ID
	// or a unique identifier for the device
	accessToken, err := jwt.CreateToken(user.Email, user.ID, deviceID, user.Role)
	if err != nil {
		return nil, fmt.Errorf("create access token failed: %w", err)
	}

	refreshToken, err := jwt.CreateRefreshToken(user.Email, deviceID, user.Role)
	if err != nil {
		return nil, fmt.Errorf("create refresh token failed: %w", err)
	}

	return &OAuthResponse{
		Status:       "success",
		Message:      "Logged in with Google",
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}, nil
}