package paymentcontroller

import (
	"github/imdinnes/mobusapi/database"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UpdateBalance(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.GetUint("userId")

		type UpdateBalanceRequest struct {
			Amount float64 `json:"amount"`
		}

		var request UpdateBalanceRequest
		if err := ctx.ShouldBindJSON(&request); err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid request"})
			return
		}

		if request.Amount <= 0 {
			ctx.JSON(400, gin.H{"error": "Amount must be greater than 0"})
			return
		}

		err := db.Transaction(func(tx *gorm.DB) error {
			var user database.User

			// Fetch user inside the transaction
			if err := tx.First(&user, id).Error; err != nil {
				return err // Automatically rolls back
			}

			// Update balance
			user.Balance += request.Amount
			if err := tx.Save(&user).Error; err != nil {
				return err // Automatically rolls back
			}

			// Create a new transaction record
			transaction := database.Transaction{
				UserID:    id,
				Amount:    request.Amount,
				CreatedAt: time.Now(),
				Type:      "credit",
				Status:    "success",
			}

			if err := tx.Create(&transaction).Error; err != nil {
				return err // Automatically rolls back
			}

			return nil // Automatically commits if no error
		})

		// Handle transaction error
		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to update balance"})
			return
		}

		ctx.JSON(200, gin.H{"message": "Balance updated successfully"})

	}
}

func GetTransactions(db *gorm.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.GetUint("userId")

		// Define a struct that only contains the selected fields
		type TransactionDTO struct {
			ID        uint      `json:"id"`
			Amount    float64   `json:"amount"`
			CreatedAt time.Time `json:"created_at"`
			Type      string    `json:"type"`
		}

		var transactions []TransactionDTO

		// Fetch last 10 transactions with only required fields
		err := db.Model(&database.Transaction{}).
			Where("user_id = ?", id).
			Order("created_at DESC").
			Select("id", "amount", "created_at", "type").
			Limit(10).
			Find(&transactions).Error

		if err != nil {
			ctx.JSON(500, gin.H{"error": "Failed to fetch transactions"})
			return
		}

		ctx.JSON(200, gin.H{"transactions": transactions})
	}
}
