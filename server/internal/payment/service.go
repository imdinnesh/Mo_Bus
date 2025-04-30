package payment

import (
	"net/http"

	"github.com/imdinnesh/mobusapi/pkg/apierror"
)
type Service interface {
	UpdateBalance(req *UpdateBalanceRequest,userID uint) (*UpdateBalanceResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) UpdateBalance(req *UpdateBalanceRequest,userID uint) (*UpdateBalanceResponse, error) {
	user,err:=s.repo.FindById(userID)
	if err != nil {
		return nil,apierror.New("user not found",http.StatusNotFound)
	}
	if err := s.repo.UpdateBalance(user, req.Amount); err != nil {
		return nil, apierror.New("failed to update balance", http.StatusInternalServerError)
	}

	return &UpdateBalanceResponse{
		Balance: user.Balance,
		Status: "success",
		Message: "balance updated successfully",
	}, nil



}




	