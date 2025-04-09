package smtp

import (
	"log"
	"gopkg.in/gomail.v2"
)

func SendEmail(receiverEmail string, subject string, body string) {
	m := gomail.NewMessage()
	m.SetHeader("From", "test@example.com")
	m.SetHeader("To", receiverEmail)
	m.SetHeader("Subject", subject)
	m.SetBody("text/plain", body)

	d := gomail.NewDialer("localhost", 2525, "", "") // No authentication required

	if err := d.DialAndSend(m); err != nil {
		log.Fatalf("Could not send email: %v", err)
	}

	log.Println("Email sent successfully!")
}
