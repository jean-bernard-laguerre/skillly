package main

import (
	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"

	"skillly/chat"
)

func main() {

	// Create a new gin router
	r := gin.Default()
	// Create array of hub
	/* hub := make(map[string]*chat.Room) */
	hub := chat.NewHub()
	go hub.RunHub()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	r.GET("/ws/:roomId", func(c *gin.Context) {
		roomId := c.Param("roomId")

		chat.ServeWs(hub, roomId, c.Writer, c.Request)

		/* if _, ok := hub[c.Param("roomId")]; !ok {
			hub[c.Param("roomId")] = chat.NewRoom()
			go hub[c.Param("roomId")].RunRoom()
		}

		chat.ServeWs(hub[c.Param("roomId")], c.Writer, c.Request) */
	})

	r.Run(":8080")

	// Create a new websocket connection

}
