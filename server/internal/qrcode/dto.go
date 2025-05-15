package qrcode

type StartTripRequest struct {
	BookingID   uint `json:"booking_id"`
	RouteID     uint `json:"route_id"`
	Source      uint `json:"source"`
	Destination uint `json:"destination"`
}
type StartTripResponse struct {
	Message    string `json:"message"`
	Status     string `json:"status"`
	SessionKey string `json:"session_key"`
}

type GenerateQRCodeResponse struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	QRCode  string `json:"qr_code"`
}

type VerifyQrCodeRequest struct {
	UserID      string `json:"user_id"`          // From scanned QR
	RouteID     string `json:"route_id"`         // From validator input
	Source      string `json:"source_stop"`      // From validator input
	Destination string `json:"destination_stop"` // From validator input
	OTP         string `json:"otp"`              // From scanned QR
	BookingID   string `json:"booking_id"`       // From scanned QR
}

type VerifyQrCodeResponse struct {
	Message    string `json:"message"`
	Status     string `json:"status"`
}


