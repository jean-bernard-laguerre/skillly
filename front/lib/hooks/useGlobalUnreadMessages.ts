import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Message } from "@/types/interfaces";

interface GlobalWebSocketState {
  isConnected: boolean;
  error: string | null;
}

/**
 * Hook global pour gérer les messages non lus de toutes les conversations
 * Ce hook écoute un WebSocket global qui reçoit tous les messages
 * et incrémente les compteurs pour les conversations où l'utilisateur n'est pas présent
 */
export function useGlobalUnreadMessages(
  _currentRoomId?: string // Paramètre ignoré pour l'instant - sera utilisé dans l'implémentation WebSocket
) {
  const { user } = useAuth();
  const { incrementUnreadCount } = useUnreadMessages();
  const [state, setState] = useState<GlobalWebSocketState>({
    isConnected: false,
    error: null,
  });

  // Variables persistantes pour la reconnexion
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 secondes

  useEffect(() => {
    if (!user?.id) return;

    let socket: WebSocket | null = null;
    let reconnectTimeout: number | null = null;

    const connect = () => {
      // Connexion WebSocket globale réelle
      const wsUrl = `${process.env.EXPO_PUBLIC_API_URL?.replace(
        /^http/,
        "ws"
      )}/ws/user/${user.id}`;

      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setState({ isConnected: true, error: null });
        reconnectAttemptsRef.current = 0; // Reset des tentatives de reconnexion
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Si c'est un nouveau message et qu'il ne vient pas de l'utilisateur actuel
          if (
            message.type === "new_message" &&
            message.senderId !== user.id.toString()
          ) {
            incrementUnreadCount(message.roomId);
          }
        } catch (error) {
          // On peut garder les erreurs parsing
        }
      };

      socket.onerror = (error) => {
        // On peut garder les erreurs
        setState({
          isConnected: false,
          error: "Erreur de connexion WebSocket globale",
        });
      };

      socket.onclose = (event) => {
        setState({ isConnected: false, error: null });

        // Tentative de reconnexion automatique
        if (
          reconnectAttemptsRef.current < maxReconnectAttempts &&
          event.code !== 1000
        ) {
          reconnectAttemptsRef.current++;

          reconnectTimeout = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          // console.log("❌ Nombre maximum de tentatives de reconnexion atteint");
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socket) {
        socket.close(1000, "Component unmounting");
      }
      setState({ isConnected: false, error: null });
    };
  }, [user?.id, incrementUnreadCount]);

  return state;
}
