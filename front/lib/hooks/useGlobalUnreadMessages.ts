import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/interfaces";
import GlobalNotificationsService from "@/services/globalNotifications.service";
import { DeviceEventEmitter } from "react-native";

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
  currentRoomId?: string // Room actuelle pour éviter d'incrémenter si l'utilisateur est dans cette room
) {
  const { user } = useAuth();
  const { incrementUnreadCount } = useUnreadMessages();
  const queryClient = useQueryClient();
  const [state, setState] = useState<GlobalWebSocketState>({
    isConnected: false,
    error: null,
  });

  // Variables persistantes pour la reconnexion
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 secondes

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let socket: WebSocket | null = null;
    let reconnectTimeout: number | null = null;
    let initTimeout: number | null = null;

    // Écouter les événements globaux via DeviceEventEmitter
    const globalMessageSubscription = DeviceEventEmitter.addListener(
      "globalMessageReceived",
      (event: any) => {
        // Si c'est un nouveau message et qu'il ne vient pas de l'utilisateur actuel
        if (
          event.senderId !== user.id.toString() &&
          event.roomId !== currentRoomId // Ne pas incrémenter si l'utilisateur est dans cette room
        ) {
          incrementUnreadCount(event.roomId);

          // Refetch automatique des conversations pour mettre à jour le dernier message
          queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
        }
      }
    );

    // Petit délai pour s'assurer que tout est bien initialisé
    initTimeout = setTimeout(() => {
      const connect = () => {
        // Connexion WebSocket globale réelle
        const baseUrl =
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
        const wsUrl = `${baseUrl.replace(/^http/, "ws")}/ws/user/${user.id}`;

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
              message.senderId !== user.id.toString() &&
              message.roomId !== currentRoomId // Ne pas incrémenter si l'utilisateur est dans cette room
            ) {
              incrementUnreadCount(message.roomId);

              // Refetch automatique des conversations pour mettre à jour le dernier message
              queryClient.invalidateQueries({ queryKey: ["chatrooms"] });
            }
          } catch (error) {
            console.error("❌ Error parsing global WebSocket message:", error);
          }
        };

        socket.onerror = (error) => {
          console.error("❌ Global WebSocket error:", error);
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
          }
        };
      };

      connect();
    }, 1000); // Délai de 1 seconde pour s'assurer que l'utilisateur est chargé

    return () => {
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socket) {
        socket.close(1000, "Component unmounting");
      }
      // Nettoyer la subscription DeviceEventEmitter
      globalMessageSubscription.remove();
      setState({ isConnected: false, error: null });
    };
  }, [user?.id, incrementUnreadCount, currentRoomId, queryClient]);

  return state;
}
