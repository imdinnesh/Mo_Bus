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
	QR_BUFFER_SECONDS   = 5
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
	utils.RedisClient.Set(context.Background(), key, jsonPayload, ttl)

	visibleQR, _ := json.Marshal(data)
	qrPng, err := qrcode.Encode(string(visibleQR), qrcode.Medium, 256)
	if err != nil {
		return "", err
	}

	return "data:image/png;base64," + base64.StdEncoding.EncodeToString(qrPng), nil
}
