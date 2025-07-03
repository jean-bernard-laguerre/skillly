package models

import "fmt"

type Hub struct {
	Clients    map[string]*Client
	Rooms      map[string]*Room
	Unregister chan *Client
	Register   chan *Client
	Broadcast  chan Message
}

func (h *Hub) RunHub() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client.Id] = client

		case client := <-h.Unregister:
			if _, ok := h.Clients[client.Id]; ok {
				delete(h.Clients, client.Id)
				close(client.Send)
			}
		case message := <-h.Broadcast:
			fmt.Println("message", message)
			if room, ok := h.Rooms[message.Room]; ok {
				room.Broadcast <- message
			}
		}
	}
}

func NewHub() *Hub {
	return &Hub{
		Clients:    make(map[string]*Client),
		Rooms:      make(map[string]*Room),
		Unregister: make(chan *Client),
		Register:   make(chan *Client),
		Broadcast:  make(chan Message),
	}
}
