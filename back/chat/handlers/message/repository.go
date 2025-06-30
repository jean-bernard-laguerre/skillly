package message

import (
	"fmt"
	messageDto "skillly/chat/handlers/message/dto"
	"skillly/chat/models"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

// MessageRepository defines the interface for message data operations
type MessageRepository interface {
	models.Repository[models.Message]
	CreateMessage(dto messageDto.CreateMessageDTO) (models.Message, error)
}

type messageRepository struct {
	models.Repository[models.Message]
	db *mongo.Database
}

// NewMessageRepository creates a new instance of MessageRepository
func NewMessageRepository(db *mongo.Database) MessageRepository {
	return &messageRepository{
		Repository: models.NewRepository[models.Message](db),
		db:         db,
	}
}

// CreateMessage inserts a new message record into the database
func (r *messageRepository) CreateMessage(dto messageDto.CreateMessageDTO) (models.Message, error) {
	message := models.Message{
		Room:      dto.Room,
		SenderID:  dto.SenderID,
		Content:   dto.Content,
		CreatedAt: time.Now(), // Set the created time to now
	}

	fmt.Println("Creating message:", message)

	err := r.Repository.Create(&message)
	if err != nil {
		return models.Message{}, err
	}

	return message, nil
}
