package apierror

type APIError struct {
	StatusCode int
	Message    string
}

func (e *APIError) Error() string {
	return e.Message
}

func New(msg string, status int) *APIError {
	return &APIError{
		Message:    msg,
		StatusCode: status,
	}
}
