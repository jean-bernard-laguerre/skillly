package broadcast

import (
	"log"
	"sync"
)

var (
	// Map pour stocker les connexions globales par utilisateur
	globalConnections = make(map[string]chan []byte)
	globalMutex       sync.RWMutex
)

// RegisterUser enregistre un utilisateur pour recevoir des messages globaux
func RegisterUser(userID string, messageChan chan []byte) {
	globalMutex.Lock()
	defer globalMutex.Unlock()

	globalConnections[userID] = messageChan
	log.Printf("🌐 Utilisateur %s enregistré pour les messages globaux", userID)
}

// UnregisterUser supprime un utilisateur de la liste des connexions globales
func UnregisterUser(userID string) {
	globalMutex.Lock()
	defer globalMutex.Unlock()

	delete(globalConnections, userID)
	log.Printf("🌐 Utilisateur %s supprimé des messages globaux", userID)
}

// BroadcastToAllUsersExcept envoie un message à tous les utilisateurs connectés sauf un
func BroadcastToAllUsersExcept(excludeUserID string, message []byte) {
	globalMutex.RLock()
	defer globalMutex.RUnlock()

	count := 0
	for userID, messageChan := range globalConnections {
		if userID == excludeUserID {
			continue // Ignorer l'utilisateur exclu
		}

		select {
		case messageChan <- message:
			log.Printf("📡 Message global envoyé à l'utilisateur %s", userID)
			count++
		default:
			log.Printf("⚠️ Buffer plein pour l'utilisateur %s", userID)
		}
	}

	log.Printf("📡 Message global diffusé à %d utilisateurs", count)
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
