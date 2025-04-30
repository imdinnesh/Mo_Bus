package payment

import "time"

type UpdateBalanceRequest struct {
	Amount float64 `json:"amount" binding:"required"`
}

type UpdateBalanceResponse struct {
	Balance float64 `json:"balance"`
	Status  string  `json:"status"`
	Message string  `json:"message"`
}

type Transactions struct {
	ID        uint      `json:"id"`
	Amount    float64   `json:"amount"`
	CreatedAt time.Time `json:"created_at"`
	Type      string    `json:"type"`
}

type GetTransactionsResponse struct {
	Transaction []Transactions `json:"transaction"`
}