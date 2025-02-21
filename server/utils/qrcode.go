package utils

import (
	"encoding/base64"
	"fmt"
	"time"
	"strings"
	"strconv"

	"github.com/skip2/go-qrcode"
)

func GenerateQRCode(data string) (string, error) {
	qrCode, err := qrcode.New(data, qrcode.Medium)
	if err != nil {
		return "", err
	}

	png, err := qrCode.PNG(256)
	if err != nil {
		return "", err
	}

	base64Image := base64.StdEncoding.EncodeToString(png)
	return base64Image, nil
}

func VerifyQRCode(qrCode string) (bool, error) {
	// Extract the email and expiry time from the QR code data
	var expiryTime int64

	parts := strings.Split(qrCode, ":")
	if len(parts) != 3 {
		return false, fmt.Errorf("invalid ticket format")
	}

	expiryTime, err := strconv.ParseInt(parts[2], 10, 64)
	if err != nil {
		return false, fmt.Errorf("invalid ticket format")
	}

	// Check if the QR code has expired
	if time.Now().Unix() > expiryTime {
		return false, nil
	}

	return true, nil
}
