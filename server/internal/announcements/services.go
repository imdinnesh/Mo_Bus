package announcements

import (
	"time"
	"net/http"
	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	CreateAnnouncement(req *CreateAnnouncementRequest) (*CreateAnnouncementResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) CreateAnnouncement(req *CreateAnnouncementRequest)(*CreateAnnouncementResponse, error) {
	announcement := &models.Accouncements{
		Title:       req.Title,
		Description: req.Description,
		Type:        req.Type,
		CreatedAt:  time.Now(),
	}

	if err := s.repo.Create(announcement); err != nil {
		return nil, apierror.New("Failed to create announcement", http.StatusInternalServerError)
	}

	return &CreateAnnouncementResponse{
		Status:  "success",
		Message: "Announcement created successfully",
	}, nil
}
	