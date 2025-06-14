package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/imdinnesh/mobusapi/internal/admin"
	"github.com/imdinnesh/mobusapi/internal/announcements"
	"github.com/imdinnesh/mobusapi/internal/auth"
	"github.com/imdinnesh/mobusapi/internal/bookings"
	"github.com/imdinnesh/mobusapi/internal/bus"
	"github.com/imdinnesh/mobusapi/internal/payment"
	"github.com/imdinnesh/mobusapi/internal/profile"
	"github.com/imdinnesh/mobusapi/internal/qrcode"
	"github.com/imdinnesh/mobusapi/internal/routeno"
	"github.com/imdinnesh/mobusapi/internal/routestop"
	"github.com/imdinnesh/mobusapi/internal/stop"
	"github.com/imdinnesh/mobusapi/internal/transactions"
	"github.com/imdinnesh/mobusapi/internal/trip"
	"github.com/imdinnesh/mobusapi/internal/user"
	"gorm.io/gorm"
)

func RegisterRoutes(r *gin.RouterGroup,db *gorm.DB){
	user.RegisterRoutes(r, db)
	admin.RegisterRoutes(r,db)
	profile.RegisterRoutes(r,db)
	routeno.RegisterRoutes(r,db)
	stop.RegisterRoutes(r,db)
	routestop.RegisterRoutes(r,db)
	auth.RegisterRoutes(r,db)
	payment.RegisterRoutes(r,db)
	bookings.RegisterRoutes(r,db)
	qrcode.RegisterRoutes(r,db)
	announcements.RegisterRoutes(r,db)
	trip.RegisterRoutes(r, db)
	transactions.RegisterRoutes(r, db)
	bus.RegisterRoutes(r, db)
}