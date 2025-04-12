package redis

import (
	"fmt"
	"time"
)

func StoreOTP(email, otp string, expiry time.Duration) error {
	return Client.Set(Ctx, "otp:"+email, otp, expiry).Err()
}

func VerifyOTP(email, enteredOTP string) (bool, error) {
	key := "otp:" + email
	val, err := Client.Get(Ctx, key).Result()
	if err != nil {
		return false, fmt.Errorf("OTP not found or expired")
	}
	if val != enteredOTP {
		return false, fmt.Errorf("invalid OTP")
	}
	Client.Del(Ctx, key)
	return true, nil
}

func CanResendOTP(email string, cooldown time.Duration) bool {
	key := "otp_cooldown:" + email
	if _, err := Client.Get(Ctx, key).Result(); err == nil {
		return false
	}
	Client.Set(Ctx, key, "1", cooldown)
	return true
}
