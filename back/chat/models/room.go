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

	// Temporary fields for processing
	Clients    map[*Client]bool `bson:"-" json:"-"`
	Unregister chan *Client     `bson:"-" json:"-"`
	Register   chan *Client     `bson:"-" json:"-"`
	Broadcast  chan Message     `bson:"-" json:"-"`
}

func (r *Room) RunRoom() {
	for {
		select {
		case client := <-r.Register:
			r.Clients[client] = true
		case client := <-r.Unregister:
			if _, ok := r.Clients[client]; ok {
				delete(r.Clients, client)
				close(client.Send)
			}
		case message := <-r.Broadcast:
			for client := range r.Clients {
				select {
				case client.Send <- []byte(message.Content):
				default:
					close(client.Send)
					delete(r.Clients, client)
				}
			}
		}
	}
}

func NewRoom(name string) *Room {
	return &Room{
		Name:       name,
		Clients:    make(map[*Client]bool),
		Unregister: make(chan *Client),
		Register:   make(chan *Client),
		Broadcast:  make(chan Message),
	}
}
