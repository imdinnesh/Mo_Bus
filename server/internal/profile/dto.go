package profile

type UserDetails struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	MobileNumber string `json:"mobile_number"`
	Gender       string `json:"gender"`
}

type UpdateUserDetailsRequest struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	MobileNumber string `json:"mobile_number"`
	Gender       string `json:"gender"`
}

type UpdateUserDetailsResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
}