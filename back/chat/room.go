package chat

import "fmt"

type Room struct {
	clients    map[*Client]bool
	unregister chan *Client
	register   chan *Client
	broadcast  chan []byte
}

type Message struct {
	Type      string `json:"type"`
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
	Content   string `json:"content"`
	ID        string `json:"id"`
}

func NewRoom() *Room {
	return &Room{
		clients:    make(map[*Client]bool),
		unregister: make(chan *Client),
		register:   make(chan *Client),
		broadcast:  make(chan []byte),
	}
}

func (r *Room) Run() {
	for {
		select {
		case client := <-r.register:
			r.clients[client] = true
		case client := <-r.unregister:
			if _, ok := r.clients[client]; ok {
				delete(r.clients, client)
				close(client.send)
			}
		case messages := <-r.broadcast:
			fmt.Println("Broadcasting message")
			for client := range r.clients {
				select {
				case client.send <- messages:
				default:
					close(client.send)
					delete(r.clients, client)
				}
			}
		}
	}
}
