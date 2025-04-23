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
	deviceID := c.Query("state") // passed as state originally

	if code == "" || deviceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing code or state"})
		return
	}
	resp, err := h.service.HandleGoogleCallback(code, deviceID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

