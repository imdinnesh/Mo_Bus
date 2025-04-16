package stop

type AddStopRequest struct {
	StopName string `json:"stop_name" binding:"required"`
}

type AddStopResponse struct {
	Status  string   `json:"status"`
	Message string `json:"message"`
}

type UpdateStopRequest struct {
	StopName string `json:"stop_name" binding:"required"`
}

type UpdateStopResponse struct {
	Status  string   `json:"status"`
	Message string `json:"message"`
}

type DeleteStopResponse struct {
	Status  string   `json:"status"`
	Message string `json:"message"`
}
