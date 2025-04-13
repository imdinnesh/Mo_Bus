package announcements

type CreateAnnouncementRequest struct {
	Title string `json:"title"`
	Description string `json:"description"`
	Type string `json:"type"` // "general" or "emergency"
}

type CreateAnnouncementResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}
