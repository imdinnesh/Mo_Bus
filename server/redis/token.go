package redis

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

var serverSalt string

func SetupSalt(salt string) {
	serverSalt = salt
}

func hashToken(token string) string {
	h := hmac.New(sha256.New, []byte(serverSalt))
	h.Write([]byte(token))
	return hex.EncodeToString(h.Sum(nil))
}

func BlacklistToken(userID uint, deviceID, token string, expiry time.Duration) error {
	key := fmt.Sprintf("blacklist:%d:%s", userID, deviceID)
	return Client.Set(Ctx, key, hashToken(token), expiry).Err()
}

func IsTokenBlacklisted(userID uint, deviceID, token string) bool {
	key := fmt.Sprintf("blacklist:%d:%s", userID, deviceID)
	val, err := Client.Get(Ctx, key).Result()
	return err == nil && val == hashToken(token)
}
