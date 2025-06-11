package transactions

import "time"

type GetCardBalaceResponse struct {
	Status  string  `json:"status"`
	Balance float64 `json:"balance"`
	Message string  `json:"message"`
}

type Transaction struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Amount    float64   `json:"amount"`
	Status    string    `json:"status"` // "success" or "failed" or "pending"
	CreatedAt time.Time `json:"created_at"`
	Type      string    `json:"type"` // "debit" or "credit"
}

type GetTransactionsResponse struct {
	Status string `json:"status"`
	Transaction []Transaction `json:"transactions"`
	Message string `json:"message"`
}
