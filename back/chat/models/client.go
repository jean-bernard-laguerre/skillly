package models

import (
	"bytes"
	"log"

	/* "skillly/chat/handlers/message" */
	messageDto "skillly/chat/handlers/message/dto"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second
	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second
	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10
	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

// Define an interface for the message service
type MessageService interface {
	CreateMessage(dto messageDto.CreateMessageDTO) (Message, error)
}

type Client struct {
	Id    string
	Hub   *Hub
	Rooms map[string]*Room
	Conn  *websocket.Conn
	// Buffered channel of outbound messages.
	Send           chan []byte
	MessageService MessageService
}

// read messages from the client WebSocket connection and forwarding them to the appropriate room for broadcasting
func (c *Client) ReadPump(room string) {
	defer func() {
		if room, ok := c.Rooms[room]; ok {
			room.Unregister <- c
		}
		c.Conn.Close()
	}()
	c.Conn.SetReadLimit(maxMessageSize)
	c.Conn.SetReadDeadline(time.Now().Add(pongWait))
	c.Conn.SetPongHandler(func(string) error { c.Conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, content, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		content = bytes.TrimSpace(bytes.Replace(content, newline, space, -1))
		if room, ok := c.Rooms[room]; ok {

			// Create a message DTO
			messageDto := messageDto.CreateMessageDTO{
				Room:     room.Name, // Assuming room has a name field
				SenderID: c.Id,
				Content:  string(content),
			}

			_, err := c.MessageService.CreateMessage(messageDto)

			if err != nil {
				log.Printf("error creating message: %v", err)
				continue
			}

			room.Broadcast <- Message{
				SenderID: c.Id,
				Content:  string(content),
			}
		}
	}
}

// handles sending messages from the client's send channel to the WebSocket connection
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.Conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.Send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.Send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func NewClient(id string, hub *Hub, conn *websocket.Conn, msgService MessageService) *Client {
	return &Client{
		Id:             id,
		Hub:            hub,
		Rooms:          make(map[string]*Room),
		Conn:           conn,
		Send:           make(chan []byte, 256),
		MessageService: msgService,
	}
}
