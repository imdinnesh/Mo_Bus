package routeno

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetRoutes(c *gin.Context) {
	response, err := h.service.GetRoutes()
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			c.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, response)
}

func (h *Handler) GetRouteById(c *gin.Context) {
	id := c.Param("id")
	response, err := h.service.GetRouteById(id)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			c.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, response)
}

func (h *Handler) AddRoute(c *gin.Context) {
	request:=AddRouteRequest{}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	response, err := h.service.AddRoute(&request)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			c.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, response)
}

func (h *Handler) UpdateRoute(c *gin.Context) {
	id := c.Param("id")
	request := UpdateRouteRequest{}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	response, err := h.service.UpdateRoute(id, &request)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			c.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, response)
}

func (h *Handler) DeleteRoute(c *gin.Context) {
	id := c.Param("id")
	response, err := h.service.DeleteRoute(id)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			c.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, response)
}





