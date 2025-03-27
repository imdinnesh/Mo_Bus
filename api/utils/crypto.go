package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"golang.org/x/crypto/nacl/secretbox"
)

// Secret key (Should be securely stored, e.g., in environment variables)
var secretPassKey [32]byte

func init() {
	_, err := rand.Read(secretPassKey[:])
	if err != nil {
		panic("Failed to generate encryption key")
	}
}

// EncryptToken encrypts the given token
func EncryptToken(token string) (string, error) {
	var nonce [24]byte
	if _, err := rand.Read(nonce[:]); err != nil {
		return "", err
	}

	encrypted := secretbox.Seal(nonce[:], []byte(token), &nonce, &secretPassKey)
	return base64.StdEncoding.EncodeToString(encrypted), nil
}

// DecryptToken decrypts the given encrypted token
func DecryptToken(encryptedToken string) (string, error) {
	data, err := base64.StdEncoding.DecodeString(encryptedToken)
	if err != nil {
		return "", err
	}

	var nonce [24]byte
	copy(nonce[:], data[:24])
	decrypted, ok := secretbox.Open(nil, data[24:], &nonce, &secretPassKey)
	if !ok {
		return "", fmt.Errorf("decryption failed")
	}

	return string(decrypted), nil
}
