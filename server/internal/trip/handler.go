package trip

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service Service
}

func NewHandler(s Service) *Handler {
	return &Handler{service: s}
}

func (h *Handler) GetRoutesByStops(c *gin.Context) {
	var req GetRoutesByStopsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, GetRoutesByStopsResponse{
			Status:  "error",
			Message: "Invalid input",
		})
		return
	}
	routes, err := h.service.GetDirectRoutes(req.SourceId, req.DestinationId)
	if len(routes) == 0 {
		c.JSON(http.StatusNotFound, GetRoutesByStopsResponse{
			Status:  "invalid",
			Message: fmt.Sprintf("No direct routes found from stop %d to stop %d", req.SourceId, req.DestinationId),
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, GetRoutesByStopsResponse{
			Status:  "error",
			Message: "Failed to fetch routes",
		})
		return
	}
	responseRoutes := make([]Route, 0, len(routes))
	for _, r := range routes {
		responseRoutes = append(responseRoutes, Route{
			ID:          r.ID,
			RouteNumber: r.RouteNumber,
			RouteName:   r.RouteName,
			Direction:   r.Direction,
		})
	}

	c.JSON(http.StatusOK, GetRoutesByStopsResponse{
		Status:  "success",
		Message: "Routes fetched successfully",
		Routes:  responseRoutes,
	})
}
