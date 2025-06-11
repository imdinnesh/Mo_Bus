package bus

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/pkg/apierror"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) AddBusToRoute(ctx *gin.Context) {
	req := &AddBusRequest{}
	if err := ctx.ShouldBindJSON(req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	response, err := h.service.AddBusToRoute(req)
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, response)
}

func (h *Handler) GetBusesByRouteId(ctx *gin.Context) {
	routeId:= ctx.Query("routeId")
	if routeId == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Route ID is required"})
		return
	}
	routeIdUint, err := strconv.ParseUint(routeId, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Route ID"})
		return
	}
	response, err := h.service.GetBusByRouteId(uint(routeIdUint))
	if err != nil {
		apiErr, ok := err.(*apierror.APIError)
		if !ok {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
			return
		}
		ctx.JSON(apiErr.StatusCode, gin.H{"error": apiErr.Message})
		return
	}
	ctx.JSON(http.StatusOK, response)
}