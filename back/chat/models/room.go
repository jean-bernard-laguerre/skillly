package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Room represents a chat room
type Room struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Name      string        `bson:"name"`
	CreatedAt time.Time     `bson:"created_at"`
}
