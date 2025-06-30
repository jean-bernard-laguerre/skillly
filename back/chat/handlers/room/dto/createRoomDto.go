package roomDto

type CreateRoomDTO struct {
	Name string `json:"name" binding:"required"`
}
