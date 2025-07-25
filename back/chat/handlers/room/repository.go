package room

import (
	"skillly/chat/models"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

// RoomRepository defines the interface for room data operations
type RoomRepository interface {
	models.Repository[models.Room]
	CreateRoom(name string) (models.Room, error)
}

type roomRepository struct {
	models.Repository[models.Room]
	db *mongo.Database
}

// NewRoomRepository creates a new instance of RoomRepository
func NewRoomRepository(db *mongo.Database) RoomRepository {
	return &roomRepository{
		Repository: models.NewRepository[models.Room](db),
		db:         db,
	}
}

// CreateRoom inserts a new room record into the database
func (r *roomRepository) CreateRoom(name string) (models.Room, error) {
	room := models.Room{
		Name:      name,
		CreatedAt: time.Now(), // Set the created time to now
	}

	err := r.Repository.Create(&room)
	if err != nil {
		return models.Room{}, err
	}

	return room, nil
}
