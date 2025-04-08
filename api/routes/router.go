package routes

import (
    "gorm.io/gorm"
    "github.com/gin-gonic/gin"
)

func RegisterAll(rg *gin.RouterGroup, db *gorm.DB) {
    UserRoutes(rg, db)
    AdminRoutes(rg, db)
    RouteRoutes(rg, db)
    StopRoutes(rg, db)
    RouteStops(rg, db)
    PaymentRoutes(rg, db)
    BookingRoutes(rg, db)
    QrCodeRoutes(rg, db)
    ProfileRoutes(rg, db)
}