package profile

import (
	"net/http"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Service interface {
	GetProfile(userID uint) (UserDetails, error)
	UpdateProfile(userID uint, userDetails UpdateUserDetailsRequest) (UpdateUserDetailsResponse, error)
}

type service struct {
	repo Repository
}

func NewService(r Repository) Service {
	return &service{repo: r}
}

func (s *service) GetProfile(userID uint) (UserDetails, error) {
	existingUser,err:=s.repo.GetProfile(userID)
	if err!=nil{
		return UserDetails{},apierror.New("User not found", http.StatusNotFound)
	}

	userDetails := UserDetails{
		Name:         existingUser.Name,
		Email:        existingUser.Email,
		MobileNumber: existingUser.MobileNumber,
		Gender: existingUser.Gender,
	}

	return userDetails, nil
}

func (s *service) UpdateProfile(userID uint, userDetails UpdateUserDetailsRequest) (UpdateUserDetailsResponse, error) {
	err := s.repo.UpdateProfile(userID, &userDetails)
	if err != nil {
		return UpdateUserDetailsResponse{}, apierror.New("Failed to update user details", http.StatusInternalServerError)
	}

	response := UpdateUserDetailsResponse{
		Message: "User details updated successfully",
		Status:  "success",
	}

	return response, nil

}




	