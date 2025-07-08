package message

import (
	"fmt"
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
	messageRepository MessageRepository
}

// NewMessageService creates a new instance of MessageService
func NewMessageService() MessageService {
	return &messageService{
		messageRepository: NewMessageRepository(config.DBMongo),
	}
}

// CreateMessage creates a new message in the database
func (s *messageService) CreateMessage(dto messageDto.CreateMessageDTO) (models.Message, error) {

	createdMessage, err := s.messageRepository.CreateMessage(dto)
	if err != nil {
		return models.Message{}, err
	}

	return createdMessage, nil
}

// GetMessagesByRoomID retrieves messages for a specific room
func (s *messageService) GetMessagesByRoomID(roomID string) ([]models.Message, error) {
	fmt.Printf("🔍 [SERVICE] Recherche des messages pour room: %s\n", roomID)

	params := utils.QueryParams{
		Filters: map[string]string{
			"room": roomID,
		},
		Sort:  "created_at",
		Order: "asc",
	}

	fmt.Printf("🔍 [SERVICE] Paramètres de recherche: %+v\n", params)

	messages, err := s.messageRepository.GetAll(params)
	if err != nil {
		fmt.Printf("❌ [SERVICE] Erreur repository: %v\n", err)
		return []models.Message{}, err
	}

	fmt.Printf("✅ [SERVICE] %d messages récupérés depuis MongoDB\n", len(messages))

	if messages == nil {
		messages = []models.Message{}
	}

	return messages, nil
}
