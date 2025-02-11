package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"skillly/chat"
	"skillly/pkg/db"
	"skillly/pkg/handlers"
)

func main() {

	// Init the database
	DB := db.Init()
	h := handlers.New(DB)
	fmt.Println(h)

	// Create a new gin router
	r := gin.Default()
	// Create array of rooms
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
