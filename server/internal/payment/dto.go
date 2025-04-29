package payment

type UpdateBalanceRequest struct {
	Amount float64 `json:"amount"`
}

type UpdateBalanceResponse struct {
	Balance float64 `json:"balance"`
	Status  string  `json:"status"`
	Message string  `json:"message"`
}