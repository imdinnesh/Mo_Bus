package crypto

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"golang.org/x/crypto/nacl/secretbox"
)

var secretPassKey [32]byte

func init() {
	_, err := rand.Read(secretPassKey[:])
	if err != nil {
		panic("Failed to generate encryption key")
	}
}

func EncryptToken(token string) (string, error) {
	var nonce [24]byte
	if _, err := rand.Read(nonce[:]); err != nil {
		return "", err
	}

	encrypted := secretbox.Seal(nonce[:], []byte(token), &nonce, &secretPassKey)
	return base64.StdEncoding.EncodeToString(encrypted), nil
}

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
