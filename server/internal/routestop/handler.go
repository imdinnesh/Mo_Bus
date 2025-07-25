package routestop

import (
	"net/http"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) AddRouteStop(ctx *gin.Context) {
	request:=AddRouteStopRequest{}
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	response, err := h.service.AddRouteStop(&request)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)


}

func (h *Handler) UpdateRouteStop(ctx *gin.Context) {
	routeStopID := ctx.Param("id")
	request := UpdateRouteStopRequest{}
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	response, err := h.service.UpdateRouteStop(routeStopID, &request)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) DeleteRouteStop(ctx *gin.Context) {
	routeStopID := ctx.Param("id")

	response, err := h.service.DeleteRouteStop(routeStopID)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	ctx.JSON(http.StatusOK, response)
}
func (h *Handler) GetRouteStops(ctx *gin.Context) {
	routeIDStr := ctx.Param("route_id")
	if routeIDStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Route ID is required"})
		return
	}

	// Convert routeIDStr to uint
	var routeID uint
	if _, err := fmt.Sscanf(routeIDStr, "%d", &routeID); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Route ID"})
		return
	}

	response, err := h.service.ViewRouteStops(routeID)
	if err != nil {
		if apiErr, ok := err.(*apierror.APIError); ok {
			ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	ctx.JSON(http.StatusOK, response)
}
	