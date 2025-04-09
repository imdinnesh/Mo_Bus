package email

import (
	"fmt"
)

type onBoardingEmail struct {
	Subject string
	Body    string
}

// Function to generate the email with dynamic values
func NewOnBoardingEmail(name, otp string) onBoardingEmail {
	return onBoardingEmail{
		Subject: "Welcome to MoBus",
		Body:    fmt.Sprintf("Hello %s,\n\nThank you for signing up for MoBus. We are excited to have you on board!\n\nYour OTP is: %s\n\nBest regards,\nMoBus Team", name, otp),
	}
}

