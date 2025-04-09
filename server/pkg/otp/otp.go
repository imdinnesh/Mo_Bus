package otp
import (
	"fmt"
	"math/rand"
)

func GenerateOTP() string {
	// Generate a random 6-digit OTP
	otp := fmt.Sprintf("%06d", rand.Intn(1000000))
	return otp
}

