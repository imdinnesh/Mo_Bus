package qrcode

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"github/imdinnes/mobusapi/utils"
	"time"

	"github.com/skip2/go-qrcode"
)

const (
	QR_VALIDITY_SECONDS   = 5
	TRIP_DURATION_MINUTES = 30
	QR_BUFFER_SECONDS     = 1000
	QR_SECRET             = "your_hardcoded_secret_key" // to be replaced
)

type QRData struct {
	UserID          string `json:"user_id"`
	RouteID         string `json:"route_id"`
	SourceStop      string `json:"source_stop"`
	DestinationStop string `json:"destination_stop"`
	OTP             string `json:"otp"`
	BoookingID      string `json:"booking_id"`
}

type QRPayload struct {
	UserID      string `json:"user_id"`
	RouteID     string `json:"route_id"`
	Source      string `json:"source"`
	Destination string `json:"destination"`
	BookingID   string `json:"booking_id"`
	Signature   string `json:"signature"`
	OTP         string `json:"otp"`
}

// Generates HMAC-SHA256 signature for QR code
func generateSignature(data, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

// Reusable helper for consistent signature generation
func generateQRCodeSignature(userID, routeID, source, destination, bookingID, otp string) string {
	raw := fmt.Sprintf("%s|%s|%s|%s|%s|%s", userID, routeID, source, destination, bookingID, otp)
	return generateSignature(raw, QR_SECRET)
}

// GenerateQRCode returns a data URI PNG QR image
func GenerateQRCode(userID, routeID, source, dest, bookingID string) (string, error) {
	otp := fmt.Sprintf("%x", time.Now().UnixNano())

	data := QRData{
		UserID:          userID,
		RouteID:         routeID,
		SourceStop:      source,
		DestinationStop: dest,
		OTP:             otp,
		BoookingID:      bookingID,
	}

	signature := generateQRCodeSignature(userID, routeID, source, dest, bookingID, otp)

	payload := map[string]string{
		"user_id":     userID,
		"route_id":    routeID,
		"source":      source,
		"destination": dest,
		"booking_id":  bookingID,
		"signature":   signature,
		"otp":         otp,
	}

	jsonPayload, _ := json.Marshal(payload)
	key := "qr:" + otp
	ttl := time.Duration(QR_VALIDITY_SECONDS+QR_BUFFER_SECONDS) * time.Second

	if err := utils.RedisClient.Set(context.Background(), key, string(jsonPayload), ttl).Err(); err != nil {
		return "", err
	}

	visibleQR, _ := json.Marshal(data)
	qrPng, err := qrcode.Encode(string(visibleQR), qrcode.Medium, 256)
	if err != nil {
		return "", err
	}

	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrPng), nil
}

// Creates a session in Redis valid for trip duration
func CreateSession(userId, bookingId, routeId, source, destination uint) (string, error) {
	sessionKey := fmt.Sprintf("trip:%d:%d", userId, bookingId)
	sessionData := map[string]string{
		"user_id":     fmt.Sprintf("%d", userId),
		"route_id":    fmt.Sprintf("%d", routeId),
		"source":      fmt.Sprintf("%d", source),
		"destination": fmt.Sprintf("%d", destination),
		"booking_id":  fmt.Sprintf("%d", bookingId),
	}

	jsonData, _ := json.Marshal(sessionData)
	err := utils.RedisClient.Set(context.Background(), sessionKey, string(jsonData), TRIP_DURATION_MINUTES*time.Minute).Err()
	if err != nil {
		return "", err
	}
	return sessionKey, nil
}

// Validates if the trip session exists and is valid
func ValidatesSession(sessionKey string) (routeID, sourceID, destID string, err error) {
	sessionData, err := utils.RedisClient.Get(context.Background(), sessionKey).Result()
	if err != nil {
		return "", "", "", fmt.Errorf("session expired")
	}

	var data map[string]string
	if err := json.Unmarshal([]byte(sessionData), &data); err != nil {
		return "", "", "", fmt.Errorf("invalid session data")
	}

	if data["user_id"] == "" || data["route_id"] == "" || data["source"] == "" || data["destination"] == "" {
		return "", "", "", fmt.Errorf("incomplete session data")
	}

	return data["route_id"], data["source"], data["destination"], nil
}

// Verifies the QR Code using Redis-stored payload and signature
func VerifyQRCode(userID, routeID, source, destination, otp string) error {
	key := "qr:" + otp
	rawPayload, err := utils.RedisClient.Get(context.Background(), key).Result()
	if err != nil {
		return errors.New("invalid or expired OTP")
	}

	var payload QRPayload
	if err := json.Unmarshal([]byte(rawPayload), &payload); err != nil {
		return errors.New("failed to parse QR payload")
	}

	// Basic field validation
	if payload.UserID != userID || payload.RouteID != routeID || payload.Source != source || payload.Destination != destination {
		return errors.New("mismatched route or stop information")
	}

	if payload.OTP == "" {
		return errors.New("OTP missing in payload")
	}

	expectedSig := generateQRCodeSignature(userID, routeID, source, destination, payload.BookingID, payload.OTP)
	if !hmac.Equal([]byte(expectedSig), []byte(payload.Signature)) {
		return errors.New("invalid signature: QR tampered or forged")
	}

	// Invalidate QR and session after verification
	_ = utils.RedisClient.Del(context.Background(), key).Err()
	sessionKey := fmt.Sprintf("trip:%s:%s", userID, payload.BookingID)
	_ = utils.RedisClient.Del(context.Background(), sessionKey).Err()

	return nil
}
