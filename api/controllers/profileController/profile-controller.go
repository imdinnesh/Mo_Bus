package profilecontroller

import (
	"github/imdinnes/mobusapi/database"
	"net/http"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetData(db *gorm.DB)gin.HandlerFunc{
	return func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")
		user := database.User{}
		type responseBody struct {
			Name         string `json:"name"`
			Email        string `json:"email"`
			MobileNumber string `json:"mobile_number"`
			Gender       string `json:"gender"`
		}
		db.Model(&user).Where("id = ?", userId).First(&user)

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"data": responseBody{
				Name:         user.Name,
				Email:        user.Email,
				MobileNumber: user.MobileNumber,
				Gender:       user.Gender,
			},
		})
	}
}

func UpdateData(db *gorm.DB)gin.HandlerFunc{
	return func(ctx *gin.Context) {
		userId := ctx.GetUint("userId")
		user := database.User{}
		type requestBody struct {
			Name         string `json:"name"`
			Email        string `json:"email"`
			MobileNumber string `json:"mobile_number"`
			Gender string `json:"gender"`
		}

		requestBodyData := requestBody{}
		if err := ctx.ShouldBindJSON(&requestBodyData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"status": "error",
				"message": "Invalid request body",
			})
			return
		}
		db.Model(&user).Where("id = ?", userId).Updates(database.User{
			Name:         requestBodyData.Name,
			Email:        requestBodyData.Email,
			MobileNumber: requestBodyData.MobileNumber,
			Gender: requestBodyData.Gender,
		})

		ctx.JSON(http.StatusOK, gin.H{
			"status": "success",
			"message": "Profile updated successfully",
		})
	}
}

