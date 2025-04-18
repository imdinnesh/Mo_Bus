package routestop

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	AddRouteStop(routeStop *AddRouteStopRequest) error
	
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) AddRouteStop(routeStop *AddRouteStopRequest) error {
	err:=s.repo.CreateRouteStop(routeStop)
	if err != nil {
		return apierror.New("Failed to add route stop",http.StatusInternalServerError)
	}

	return nil		
}

