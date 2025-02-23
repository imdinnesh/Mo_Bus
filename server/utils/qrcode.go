package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/skip2/go-qrcode"
)

// Secret key for HMAC signing
var secret = []byte("supersecurekey456")

// GenerateSignature creates an HMAC signature from the provided data
func generateSignature(data string) string {
	h := hmac.New(sha256.New, secret)
	h.Write([]byte(data))
	return base64.URLEncoding.EncodeToString(h.Sum(nil))
}

// VerifySignature compares the expected and actual signatures
func verifySignature(data, signature string) bool {
	expectedSignature := generateSignature(data)
	return hmac.Equal([]byte(expectedSignature), []byte(signature))
}

// GenerateQRCode signs the provided data and encodes it into a QR code
func GenerateQRCode(data string) (string, error) {
	// Sign the data using HMAC
	signature := generateSignature(data)

	// Append signature to the data
	fullData := fmt.Sprintf("%s:%s", data, signature)

	// Generate QR code
	qrCode, err := qrcode.New(fullData, qrcode.Medium)
	if err != nil {
		return "", err
	}

	// Convert QR code to PNG and encode in base64
	png, err := qrCode.PNG(256)
	if err != nil {
		return "", err
	}

	base64Image := base64.StdEncoding.EncodeToString(png)
	return base64Image, nil
}

// VerifyQRCode extracts and validates the QR code data, expiry, and signature
func VerifyQRCode(qrCodeData string) (int64, bool, error) {
	
	// Split the decoded data
	parts := strings.Split(string(qrCodeData), ":")
	if len(parts) != 4 { // email, ticketID, expiry, signature
		return 0, false, fmt.Errorf("invalid QR code format")
	}

	ticketID, err := strconv.ParseInt(parts[1], 10, 64)
	if err != nil {
		return 0, false, fmt.Errorf("invalid ticket ID format")
	}

	expiryTime, err := strconv.ParseInt(parts[2], 10, 64)
	if err != nil {
		return 0, false, fmt.Errorf("invalid expiry time format")
	}

	signature := parts[3]

	// Recreate the data string for verification (without the signature)
	data := fmt.Sprintf("%s:%d:%d", parts[0], ticketID, expiryTime)

	// Verify expiry
	if time.Now().Unix() > expiryTime {
		return 0, false, fmt.Errorf("QR code has expired")
	}

	// Verify signature
	if !verifySignature(data, signature) {
		return 0, false, fmt.Errorf("invalid QR code signature")
	}

	return ticketID, true, nil
}
