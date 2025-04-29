package payment

import (

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
	return nil, nil
}




	