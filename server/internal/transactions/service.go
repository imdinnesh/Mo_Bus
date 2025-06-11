package transactions

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	GetBalance(UserId uint) (*GetCardBalaceResponse, error)
	GetTransactions(UserId uint) (*GetTransactionsResponse, error)
}
type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) GetBalance(userId uint) (*GetCardBalaceResponse, error) {
	user,err:=s.repo.FindById(userId)
	if err != nil {
		return nil, apierror.New("user not found", http.StatusNotFound)
	}
	balance:=user.Balance

	if balance < 0 {
		return nil, apierror.New("Insufficient balance", http.StatusBadRequest)
	}
	return &GetCardBalaceResponse{
		Status:  "success",
		Balance: balance,
		Message: "balance retrieved successfully",
	}, nil
}

func (s *service) GetTransactions(userId uint) (*GetTransactionsResponse, error) {
	
	transactions, err := s.repo.GetTransactions(userId)
	if err != nil {
		return nil, apierror.New("failed to retrieve transactions", http.StatusInternalServerError)
	}

	responseTransactions := make([]Transaction, 0, len(transactions))
	for _, t := range transactions {
		responseTransactions = append(responseTransactions, Transaction{
			ID:        t.ID,
			Amount:    t.Amount,
			Type:      t.Type,
			Status:    t.Status,
			CreatedAt: t.CreatedAt,
		})
	}
	return &GetTransactionsResponse{
		Status:        "success",
		Message:       "transactions retrieved successfully",
		Transaction:  responseTransactions,
	}, nil	
}