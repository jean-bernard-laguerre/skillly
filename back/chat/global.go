package chat

import (
	"log"
	"net/http"
	"skillly/chat/broadcast"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var (
	globalUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	// Map pour stocker les connexions globales par utilisateur
	globalConnections = make(map[string]*GlobalClient)
	globalMutex       sync.RWMutex
)

// GlobalClient représente un client connecté au WebSocket global
type GlobalClient struct {
	UserID string
	Conn   *websocket.Conn
	Send   chan []byte
}

// ServeGlobalWs gère les connexions WebSocket globales
func ServeGlobalWs(userID string, w http.ResponseWriter, r *http.Request) {
	conn, err := globalUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Erreur lors de l'upgrade WebSocket global: %v", err)
		return
	}

	// Créer un nouveau client global
	client := &GlobalClient{
		UserID: userID,
		Conn:   conn,
		Send:   make(chan []byte, 256),
	}

	// Enregistrer le client global dans les deux systèmes
	globalMutex.Lock()
	globalConnections[userID] = client
	globalMutex.Unlock()

	broadcast.RegisterUser(userID, client.Send)

	log.Printf("🌐 Client global connecté pour l'utilisateur: %s", userID)

	// Démarrer les goroutines de lecture et d'écriture
	go client.writePump()
	go client.readPump()
}

// writePump gère l'envoi de messages au client
func (c *GlobalClient) writePump() {
	ticker := time.NewTicker(30 * time.Second) // Ping toutes les 30 secondes
	defer func() {
		ticker.Stop()
		c.Conn.Close()

		// Nettoyer lors de la déconnexion
		globalMutex.Lock()
		delete(globalConnections, c.UserID)
		globalMutex.Unlock()

		broadcast.UnregisterUser(c.UserID)
		log.Printf("🌐 Client global déconnecté pour l'utilisateur: %s", c.UserID)
	}()

	for {
		select {
		case message, ok := <-c.Send:
			if !ok {
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Printf("Erreur d'écriture WebSocket global: %v", err)
				return
			}
		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				log.Printf("Erreur d'envoi ping WebSocket global: %v", err)
				return
			}
		}
	}
}

// readPump gère la lecture des messages du client (pour les pings/pongs)
func (c *GlobalClient) readPump() {
	defer func() {
		c.Conn.Close()

		// Nettoyer lors de la déconnexion (éviter le double nettoyage)
		globalMutex.Lock()
		if _, exists := globalConnections[c.UserID]; exists {
			delete(globalConnections, c.UserID)
			broadcast.UnregisterUser(c.UserID)
			log.Printf("🌐 Client global déconnecté pour l'utilisateur: %s", c.UserID)
		}
		globalMutex.Unlock()
	}()

	c.Conn.SetReadLimit(512)
	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, _, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("Erreur de lecture WebSocket global: %v", err)
			}
			break
		}
	}
}

// BroadcastToUser envoie un message à un utilisateur spécifique via son WebSocket global
func BroadcastToUser(userID string, message []byte) {
	globalMutex.RLock()
	client, exists := globalConnections[userID]
	globalMutex.RUnlock()

	if exists {
		select {
		case client.Send <- message:
			log.Printf("📡 Message global envoyé à l'utilisateur %s", userID)
		default:
			log.Printf("⚠️ Buffer plein pour l'utilisateur %s, fermeture de la connexion", userID)
			client.Conn.Close()
		}
	} else {
		log.Printf("ℹ️ Utilisateur %s non connecté au WebSocket global", userID)
	}
}

// BroadcastToAllUsers envoie un message à tous les utilisateurs connectés
func BroadcastToAllUsers(message []byte) {
	globalMutex.RLock()
	defer globalMutex.RUnlock()

	for userID, client := range globalConnections {
		select {
		case client.Send <- message:
			log.Printf("📡 Message global envoyé à l'utilisateur %s", userID)
		default:
			log.Printf("⚠️ Buffer plein pour l'utilisateur %s, fermeture de la connexion", userID)
			client.Conn.Close()
		}
	}
}

// BroadcastToAllUsersExcept envoie un message à tous les utilisateurs connectés sauf un
func BroadcastToAllUsersExcept(excludeUserID string, message []byte) {
	globalMutex.RLock()
	defer globalMutex.RUnlock()

	for userID, client := range globalConnections {
		if userID == excludeUserID {
			continue // Ignorer l'utilisateur exclu
		}

		select {
		case client.Send <- message:
			log.Printf("📡 Message global envoyé à l'utilisateur %s", userID)
		default:
			log.Printf("⚠️ Buffer plein pour l'utilisateur %s, fermeture de la connexion", userID)
			client.Conn.Close()
		}
	}
}

// GetConnectedUsers retourne la liste des utilisateurs connectés
func GetConnectedUsers() []string {
	globalMutex.RLock()
	defer globalMutex.RUnlock()

	users := make([]string, 0, len(globalConnections))
	for userID := range globalConnections {
		users = append(users, userID)
	}
	return users
}
