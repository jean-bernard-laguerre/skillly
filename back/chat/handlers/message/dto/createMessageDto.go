package messageDto

type CreateMessageDTO struct {
	Room     string `json:"room_id" binding:"required"`
	SenderID string `json:"sender_id" binding:"required"`
	Content  string `json:"content" binding:"required"`
}
