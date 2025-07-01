package message

import (
	"skillly/chat/config"
	messageDto "skillly/chat/handlers/message/dto"
	"skillly/chat/models"
	"skillly/pkg/utils"
)

type MessageService interface {
	CreateMessage(dto messageDto.CreateMessageDTO) (models.Message, error)
	GetMessagesByRoomID(roomID string) ([]models.Message, error)
}

type messageService struct {
	repository MessageRepository
}

// NewMessageService creates a new instance of MessageService
func NewMessageService() MessageService {
	return &messageService{
		repository: NewMessageRepository(config.DBMongo),
	}
}

// CreateMessage creates a new message in the database
func (s *messageService) CreateMessage(dto messageDto.CreateMessageDTO) (models.Message, error) {

	createdMessage, err := s.repository.CreateMessage(dto)
	if err != nil {
		return models.Message{}, err
	}

	return createdMessage, nil
}

// GetMessagesByRoomID retrieves messages for a specific room
func (s *messageService) GetMessagesByRoomID(roomID string) ([]models.Message, error) {
	params := utils.QueryParams{
		Filters: map[string]string{
			"room": "test_room", // Replace with actual room name
		},
		Sort:  "created_at",
		Order: "asc",
	}

	messages, err := s.repository.GetAll(params)
	if err != nil {
		return nil, err
	}

	return messages, nil
}
