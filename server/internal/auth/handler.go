package auth
import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GoogleLogin(c *gin.Context) {
	deviceID := c.Query("device_id")
	url := h.service.GetGoogleLoginURL(deviceID)
	c.Redirect(http.StatusTemporaryRedirect, url)
}


func (h *Handler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	deviceID := c.Query("state")

	if code == "" || deviceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing code or state"})
		return
	}

	resp, err := h.service.HandleGoogleCallback(code, deviceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set tokens in HTTP-only, Secure cookies
	c.SetCookie("access_token", resp.AccessToken, 3600, "/", "localhost", false, true)
	c.SetCookie("refresh_token", resp.RefreshToken, 7*24*3600, "/", "localhost", false, true)

	// Redirect to frontend dashboard
	c.Redirect(http.StatusTemporaryRedirect, "http://localhost:3000/dashboard")
}

