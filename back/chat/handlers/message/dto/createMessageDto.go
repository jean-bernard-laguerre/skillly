package messageDto

type CreateMessageDTO struct {
	Room     string `json:"room" binding:"required"`
	SenderID string `json:"sender" binding:"required"`
	Content  string `json:"content" binding:"required"`
}
