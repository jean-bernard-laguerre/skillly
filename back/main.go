package main

import (
	"github.com/joho/godotenv"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"

	"skillly/chat"

	"skillly/pkg/db"
	"skillly/pkg/handlers/auth"
	"skillly/pkg/handlers/certification"
	"skillly/pkg/handlers/company"
	"skillly/pkg/handlers/jobPost"
	"skillly/pkg/handlers/skill"
)

func main() {

	_ = godotenv.Load()

	// Init the database
	db.SetupDB()

	// Create a new gin router
	r := gin.Default()
	// Create a new chat hub
	hub := chat.NewHub()
	go hub.RunHub()

	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
	}))

	// Add routes
	auth.AddRoutes(r)
	company.AddRoutes(r)
	jobPost.AddRoutes(r)
	skill.AddRoutes(r)
	certification.AddRoutes(r)

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
