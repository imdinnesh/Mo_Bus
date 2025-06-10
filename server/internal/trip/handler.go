package trip

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

func (h *Handler) GetRoutesByStops(ctx *gin.Context) {
	req := GetRoutesByStopsRequest{}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, GetRoutesByStopsResponse{
			Status:  "error",
			Message: "Invalid input",
		})
		return
	}
	response, err := h.service.GetDirectRoutes(&req)
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
