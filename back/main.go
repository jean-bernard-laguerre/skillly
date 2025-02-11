package main

import (
	"net/http"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"

	"skillly/chat"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	/* ReadBufferSize:  1024,
	WriteBufferSize: 1024, */
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {

	// Create a new gin router
	r := gin.Default()
	// Create array of hub
	hub := make(map[string]*chat.Room)

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	r.GET("/ws/:roomId", func(c *gin.Context) {
		if _, ok := hub[c.Param("roomId")]; !ok {
			hub[c.Param("roomId")] = chat.NewRoom()
			go hub[c.Param("roomId")].Run()
		}

		chat.ServeWs(hub[c.Param("roomId")], c.Writer, c.Request)
	})

	r.Run(":8080")

	// Create a new websocket connection

}
