package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

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

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:"},
	}))

	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Hello, World!",
		})
	})

	r.Run(":8080")

	// Create a new websocket connection

}
