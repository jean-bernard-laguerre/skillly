package main

import (
	"fmt"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"

	"skillly/chat"

	"skillly/pkg/config"
	"skillly/pkg/db"
	"skillly/pkg/handlers"
	"skillly/pkg/handlers/auth"
)

func main() {

	// Init the database
	db.Init()
	h := handlers.New(config.DB)
	fmt.Println(h)

	// Create a new gin router
	r := gin.Default()
	// Create array of hub
	/* hub := make(map[string]*chat.Room) */
	hub := chat.NewHub()
	go hub.RunHub()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))

	// Add routes
	auth.AddRoutes(r)

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	r.GET("/ws/:roomId", func(c *gin.Context) {
		roomId := c.Param("roomId")

		chat.ServeWs(hub, roomId, c.Writer, c.Request)
	})

	r.Run(":8080")

	// Create a new websocket connection

}
