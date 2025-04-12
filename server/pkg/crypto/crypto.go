package crypto

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/nacl/secretbox"
)

var secretPassKey [32]byte
var isInitialized bool

// Init sets the secret encryption key from a Base64-encoded string
func Init(base64Key string) error {
	key, err := base64.StdEncoding.DecodeString(base64Key)
	if err != nil {
		return fmt.Errorf("failed to decode encryption key: %w", err)
	}
	if len(key) != 32 {
		return fmt.Errorf("invalid encryption key length: must be 32 bytes")
	}
	copy(secretPassKey[:], key)
	isInitialized = true
	return nil
}

// EncryptToken encrypts a string token using NaCl secretbox
func EncryptToken(token string) (string, error) {
	if !isInitialized {
		return "", fmt.Errorf("encryption key not initialized")
	}

	var nonce [24]byte
	if _, err := rand.Read(nonce[:]); err != nil {
		return "", fmt.Errorf("failed to generate nonce: %w", err)
	}

	encrypted := secretbox.Seal(nonce[:], []byte(token), &nonce, &secretPassKey)
	return base64.StdEncoding.EncodeToString(encrypted), nil
}

// DecryptToken decrypts a previously encrypted token
func DecryptToken(encryptedToken string) (string, error) {
	if !isInitialized {
		return "", fmt.Errorf("encryption key not initialized")
	}

	data, err := base64.StdEncoding.DecodeString(encryptedToken)
	if err != nil {
		return "", fmt.Errorf("failed to decode encrypted token: %w", err)
	}
	if len(data) < 24 {
		return "", fmt.Errorf("invalid encrypted data")
	}

	var nonce [24]byte
	copy(nonce[:], data[:24])
	decrypted, ok := secretbox.Open(nil, data[24:], &nonce, &secretPassKey)
	if !ok {
		return "", fmt.Errorf("decryption failed")
	}

	return string(decrypted), nil
}
