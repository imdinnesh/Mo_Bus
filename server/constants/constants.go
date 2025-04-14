package constants

import "time"

const AccessTokenExpiry= time.Minute*30
const RefreshTokenExpiry= time.Hour * 24 * 7
const ShutdownTimeout= time.Second*5