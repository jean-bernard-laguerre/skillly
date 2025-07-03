package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Message represents a message in a chat room
type Message struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Room      string        `bson:"room"`
	SenderID  string        `bson:"sender_id"`
	Content   string        `bson:"content"`
	CreatedAt time.Time     `bson:"created_at"`
}
