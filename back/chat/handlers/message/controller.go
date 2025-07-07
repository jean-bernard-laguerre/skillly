package message

import (
	"fmt"
	"net/http"
	"skillly/chat/models"

	"github.com/gin-gonic/gin"
)

// GetMessagesByRoomHandler récupère tous les messages d'une room spécifique
// @Summary Récupérer les messages d'une room
// @Description Récupère l'historique des messages d'une conversation
// @Tags messages
// @Accept json
// @Produce json
// @Param roomId path string true "ID de la room"
// @Success 200 {array} models.Message "Liste des messages"
// @Failure 400 {object} map[string]string "Erreur de validation"
// @Failure 500 {object} map[string]string "Erreur serveur"
// @Router /messages/room/{roomId} [get]
func GetMessagesByRoomHandler(c *gin.Context) {
	roomID := c.Param("roomId")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room ID requis"})
		return
	}

	fmt.Printf("🔍 [MESSAGES] Récupération des messages pour la room: %s\n", roomID)

	messageService := NewMessageService()
	messages, err := messageService.GetMessagesByRoomID(roomID)
	if err != nil {
		fmt.Printf("❌ [MESSAGES] Erreur lors de la récupération: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erreur lors de la récupération des messages: " + err.Error()})
		return
	}

	fmt.Printf("✅ [MESSAGES] %d messages trouvés pour la room %s\n", len(messages), roomID)

	// Log détaillé de tous les messages pour debug
	for i, msg := range messages {
		fmt.Printf("[MESSAGES][%d] Room=%s, Sender=%s, Content=%s, CreatedAt=%v\n", i, msg.Room, msg.SenderID, msg.Content, msg.CreatedAt)
	}

	// Log du premier message pour debug
	if len(messages) > 0 {
		fmt.Printf("📝 [MESSAGES] Premier message: Room=%s, Sender=%s, Content=%s\n",
			messages[0].Room, messages[0].SenderID, messages[0].Content)
	} else {
		fmt.Printf("📝 [MESSAGES] Aucun message trouvé pour la room %s\n", roomID)
	}

	// S'assurer qu'on retourne toujours un tableau JSON valide
	if messages == nil {
		messages = []models.Message{}
	}

	c.JSON(http.StatusOK, messages)
}

// AddRoutes ajoute les routes pour les messages
func AddRoutes(r *gin.Engine) {
	messageGroup := r.Group("/messages")
	{
		messageGroup.GET("/room/:roomId", GetMessagesByRoomHandler)
	}
}
