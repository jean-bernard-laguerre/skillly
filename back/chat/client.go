package chat

import (
	"bytes"
	"log"
	"net/http"
	"skillly/chat/config"
	"skillly/chat/handlers/message"
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

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Client struct {
	id    string
	hub   *Hub
	rooms map[string]*Room
	conn  *websocket.Conn
	// Buffered channel of outbound messages.
	send                 chan []byte
	clientMessageService message.MessageService
}

func NewClient(id string, hub *Hub, conn *websocket.Conn) *Client {
	return &Client{
		id:                   id,
		hub:                  hub,
		rooms:                make(map[string]*Room),
		conn:                 conn,
		send:                 make(chan []byte, 256),
		clientMessageService: message.NewMessageService(message.NewMessageRepository(config.DBMongo)),
	}
}

// read messages from the client WebSocket connection and forwarding them to the appropriate room for broadcasting
func (c *Client) readPump(room string) {
	defer func() {
		if room, ok := c.rooms[room]; ok {
			room.unregister <- c
		}
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, content, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		content = bytes.TrimSpace(bytes.Replace(content, newline, space, -1))
		if room, ok := c.rooms[room]; ok {

			// Create a message DTO
			messageDto := messageDto.CreateMessageDTO{
				Room:     "testField", // Assuming room has a name field
				SenderID: c.id,
				Content:  string(content),
			}

			_, err := c.clientMessageService.CreateMessage(messageDto)

			if err != nil {
				log.Printf("error creating message: %v", err)
				continue
			}

			room.broadcast <- Message{
				Sender:  c.id,
				Content: content,
			}
		}
	}
}

// handles sending messages from the client's send channel to the WebSocket connection
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// serveWs handles websocket requests from the peer.
func ServeWs(hub *Hub, room string, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// Create a new client
	client := NewClient(r.URL.Query().Get("id"), hub, conn)
	// Register the client to the hub
	hub.register <- client
	// Create a new room
	if _, ok := hub.rooms[room]; !ok {
		hub.rooms[room] = NewRoom()
		go hub.rooms[room].RunRoom()
	}

	// Register the client to the room
	hub.rooms[room].register <- client
	client.rooms[room] = hub.rooms[room]

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump(room)
}
