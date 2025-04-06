package qrcode

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github/imdinnes/mobusapi/utils"
	"time"
	"github.com/skip2/go-qrcode"
)

const (
	QR_VALIDITY_SECONDS = 5
	TRIP_DURATION_MINUTES = 30
	QR_BUFFER_SECONDS   = 30
	QR_SECRET           = "your_hardcoded_secret_key" // Replace this later
)

type QRData struct {
	UserID          string `json:"user_id"`
	RouteID         string `json:"route_id"`
	SourceStop      string `json:"source_stop"`
	DestinationStop string `json:"destination_stop"`
	OTP             string `json:"otp"`
}

func generateSignature(data, secret string) string {
	h := hmac.New(sha256.New, []byte(secret))
	h.Write([]byte(data))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

func GenerateQRCode(userID, routeID, source, dest string) (string, error) {
	otp := fmt.Sprintf("%x", time.Now().UnixNano())

	data := QRData{
		UserID:          userID,
		RouteID:         routeID,
		SourceStop:      source,
		DestinationStop: dest,
		OTP:             otp,
	}

	raw := fmt.Sprintf("%s|%s|%s|%s|%s", userID, routeID, source, dest, otp)
	signature := generateSignature(raw, QR_SECRET)

	payload := map[string]string{
		"user_id":     userID,
		"route_id":    routeID,
		"source":      source,
		"destination": dest,
		"signature":   signature,
	}

	jsonPayload, _ := json.Marshal(payload)
	key := "qr:" + otp
	ttl := time.Duration(QR_VALIDITY_SECONDS+QR_BUFFER_SECONDS) * time.Second
	err:=utils.RedisClient.Set(context.Background(),key, string(jsonPayload), ttl).Err()
	if err != nil {
		return "", err
	}
	visibleQR, _ := json.Marshal(data)
	qrPng, err := qrcode.Encode(string(visibleQR), qrcode.Medium, 256)
	if err != nil {
		return "", err
	}

	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrPng), nil
}

func CreateSession(userId uint,BookingId uint,routeId uint ,source uint ,destination uint) (string, error) {
	sessionKey := fmt.Sprintf("trip:%d:%d",userId, BookingId)
	sessionData := map[string]string{
		"user_id":     fmt.Sprintf("%d",userId),
		"route_id":    fmt.Sprintf("%d", routeId),
		"source":      fmt.Sprintf("%d", source),
		"destination": fmt.Sprintf("%d", destination),
		"booking_id":  fmt.Sprintf("%d", BookingId),
	}

	jsonData, _ := json.Marshal(sessionData)
	err := utils.RedisClient.Set(context.Background(), sessionKey, string(jsonData), TRIP_DURATION_MINUTES*time.Minute).Err()
	if err != nil {
		return "", err
	}
	return sessionKey, nil
}

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
		return "", "", "", fmt.Errorf("invalid session data")
	}


	routeID = data["route_id"]
	sourceID = data["source"]
	destID = data["destination"]

	return routeID, sourceID, destID, nil
}
