package chat

import (
	"log"
	"net/http"
	"skillly/chat/handlers/message"
	"skillly/chat/models"

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

// serveWs handles websocket requests from the peer.
func ServeWs(hub *models.Hub, room string, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	// Create a new client
	client := models.NewClient(r.URL.Query().Get("id"), hub, conn, message.NewMessageService())
	// Register the client to the hub
	hub.Register <- client
	// Create a new room
	if _, ok := hub.Rooms[room]; !ok {
		hub.Rooms[room] = models.NewRoom(
			room, // Room name from the URL
		)
		go hub.Rooms[room].RunRoom()
	}

	// Register the client to the room
	hub.Rooms[room].Register <- client
	client.Rooms[room] = hub.Rooms[room]

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.WritePump()
	go client.ReadPump(room)
}
