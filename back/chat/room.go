package chat

import (
	"fmt"
)

type Hub struct {
	clients    map[string]*Client
	rooms      map[string]*Room
	unregister chan *Client
	register   chan *Client
	broadcast  chan Message
}
type Room struct {
	clients    map[*Client]bool
	unregister chan *Client
	register   chan *Client
	broadcast  chan Message
}

type Message struct {
	Type    string `json:"type"`
	Sender  string `json:"sender"`
	Room    string `json:"recipient"`
	Content []byte `json:"content"`
	ID      string `json:"id"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		rooms:      make(map[string]*Room),
		unregister: make(chan *Client),
		register:   make(chan *Client),
		broadcast:  make(chan Message),
	}
}

func NewRoom() *Room {
	return &Room{
		clients:    make(map[*Client]bool),
		unregister: make(chan *Client),
		register:   make(chan *Client),
		broadcast:  make(chan Message),
	}
}

func (h *Hub) RunHub() {
	for {
		select {
		case client := <-h.register:
			h.clients[client.id] = client

		case client := <-h.unregister:
			if _, ok := h.clients[client.id]; ok {
				delete(h.clients, client.id)
				close(client.send)
			}
		case message := <-h.broadcast:
			fmt.Println("message", message)
			if room, ok := h.rooms[message.Room]; ok {
				room.broadcast <- message
			}
		}
	}
}

func (r *Room) RunRoom() {
	for {
		select {
		case client := <-r.register:
			r.clients[client] = true
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				delete(r.clients, client)
				close(client.send)
			}
		case message := <-r.broadcast:
			for client := range r.clients {
				select {
				case client.send <- message.Content:
				default:
					close(client.send)
					delete(r.clients, client)
				}
			}
		}
	}
}
