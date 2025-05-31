package stop

import (
	"net/http"

	"github.com/imdinnesh/mobusapi/models"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	AddStop(req *AddStopRequest) (*AddStopResponse, error)
	UpdateStop(id string, req *UpdateStopRequest) (*UpdateStopResponse, error)
	DeleteStop(id string) (*DeleteStopResponse, error)
	GetStops() (*GetStopsResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) AddStop(req *AddStopRequest) (*AddStopResponse, error) {
	stop := &models.Stop{
		StopName: req.StopName,
	}

	if err := s.repo.AddStop(stop); err != nil {
		return nil, apierror.New("Failed to add stop", http.StatusInternalServerError)
	}

	return &AddStopResponse{
		Status:"success",
		Message: "Stop added successfully",
	}, nil
}


func (s *service) UpdateStop(id string, req *UpdateStopRequest) (*UpdateStopResponse, error) {
	err:=s.repo.UpdateStop(id, req)
	if err != nil {
		return nil, apierror.New("Failed to update stop", http.StatusInternalServerError)
	}
	return &UpdateStopResponse{
		Status: "success",
		Message: "Stop updated successfully",
	}, nil
}

func (s *service) DeleteStop(id string) (*DeleteStopResponse, error) {
	err := s.repo.DeleteStop(id)
	if err != nil {
		return nil, apierror.New("Failed to delete stop", http.StatusInternalServerError)
	}
	return &DeleteStopResponse{
		Status: "success",
		Message: "Stop deleted successfully",
	}, nil
}

func (s *service) GetStops() (*GetStopsResponse, error) {
	stops, err := s.repo.GetStops()
	if err != nil {
		return nil, apierror.New("Failed to get stops", http.StatusInternalServerError)
	}

	response := &GetStopsResponse{
		Stops: make([]Stop, len(stops)),
	}

	for i, stop := range stops {
		response.Stops[i] = Stop{
			ID:       stop.ID,
			StopName: stop.StopName,
		}
	}

	return response, nil
}