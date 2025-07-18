package handlers

import (
	"skillly/chat"
	"skillly/chat/handlers/message"
	"skillly/chat/models"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up the websocket and HTTP routes for the application

func AddRoutes(r *gin.Engine, hub *models.Hub) {

	message.AddRoutes(r)
	wsGroup := r.Group("/ws")
	{
		// @Summary WebSocket Connection
		// @Description Établit une connexion WebSocket pour le chat en temps réel
		// @Tags websocket
		// @Param roomId path string true "ID de la room de chat"
		// @Router /ws/{roomId} [get]
		wsGroup.GET("/:roomId", func(c *gin.Context) {
			roomId := c.Param("roomId")

			chat.ServeWs(hub, roomId, c.Writer, c.Request)
		})

		// @Summary Global WebSocket Connection
		// @Description Établit une connexion WebSocket globale pour recevoir tous les messages de l'utilisateur
		// @Tags websocket
		// @Param userId path string true "ID de l'utilisateur"
		// @Router /ws/user/{userId} [get]
		wsGroup.GET("/user/:userId", func(c *gin.Context) {
			userID := c.Param("userId")
			chat.ServeGlobalWs(userID, c.Writer, c.Request)
		})
	}
}
