import { useEffect, useState, useRef, useCallback } from "react";
import { Message } from "@/types/interfaces";
import { useAuth } from "@/context/AuthContext";
import { getWebSocketUrl } from "@/services/message.service";
import GlobalNotificationsService from "@/services/globalNotifications.service";

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

// Map globale pour stocker les connexions WebSocket uniques par room
const globalConnections = new Map<string, WebSocket>();

// Map pour stocker les messages déjà traités (déduplication)
const processedMessages = new Map<string, Set<string>>();

export function useChatWS(
  chatroomId: string,
  onMessage: (message: Message) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
) {
  const { user } = useAuth();
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Références pour les callbacks pour éviter les re-renders
  const onMessageRef = useRef(onMessage);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Mettre à jour les références quand les callbacks changent
  useEffect(() => {
    onMessageRef.current = onMessage;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onMessage, onConnect, onDisconnect]);

  const connect = useCallback(() => {
    if (!chatroomId || !user?.id) return;

    const connectionKey = `room-${chatroomId}`;

    // Vérifier s'il y a déjà une connexion active pour cette room
    const existingConnection = globalConnections.get(connectionKey);
    if (
      existingConnection &&
      existingConnection.readyState === WebSocket.OPEN
    ) {
      console.log(
        "Réutilisation de la connexion existante pour room:",
        chatroomId
      );
      setState({
        isConnected: true,
        isConnecting: false,
        error: null,
      });
      onConnectRef.current?.();
      return;
    }

    // Fermer la connexion existante si elle existe mais n'est pas ouverte
    if (existingConnection) {
      console.log("Fermeture de la connexion existante pour room:", chatroomId);
      existingConnection.close(1000, "Replacing connection");
      globalConnections.delete(connectionKey);
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const wsUrl = getWebSocketUrl(chatroomId, user.id.toString());
      console.log(
        "Création d'une nouvelle connexion WebSocket pour room:",
        chatroomId
      );

      const socket = new WebSocket(wsUrl);
      globalConnections.set(connectionKey, socket);

      socket.onopen = () => {
        console.log("WebSocket connection established for room:", chatroomId);
        setState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
        onConnectRef.current?.();
      };

      socket.onmessage = (event) => {
        try {
          const message: Message = JSON.parse(event.data);

          // Créer une clé unique pour ce message pour la déduplication
          const messageKey = `${message.content}-${message.sender}-${message.sent_at}`;
          const roomMessageKey = `${connectionKey}-${messageKey}`;

          // Vérifier si ce message a déjà été traité
          if (!processedMessages.has(connectionKey)) {
            processedMessages.set(connectionKey, new Set());
          }

          const roomProcessedMessages = processedMessages.get(connectionKey)!;

          if (roomProcessedMessages.has(messageKey)) {
            console.log("Message dupliqué ignoré:", message.content);
            return;
          }

          // Marquer le message comme traité
          roomProcessedMessages.add(messageKey);

          // Nettoyer les anciens messages (garder seulement les 100 derniers)
          if (roomProcessedMessages.size > 100) {
            const messagesArray = Array.from(roomProcessedMessages);
            roomProcessedMessages.clear();
            messagesArray
              .slice(-50)
              .forEach((msg) => roomProcessedMessages.add(msg));
          }

          console.log("Nouveau message traité:", message.content);
          onMessageRef.current(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error for room:", chatroomId, error);
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Erreur de connexion WebSocket",
        }));
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed for room:", chatroomId);
        globalConnections.delete(connectionKey);
        processedMessages.delete(connectionKey);
        setState({
          isConnected: false,
          isConnecting: false,
          error:
            event.code !== 1000
              ? "Connexion fermée de manière inattendue"
              : null,
        });
        onDisconnectRef.current?.();
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setState({
        isConnected: false,
        isConnecting: false,
        error: "Impossible de créer la connexion WebSocket",
      });
    }
  }, [chatroomId, user?.id]);

  const disconnect = useCallback(() => {
    const connectionKey = `room-${chatroomId}`;
    const socket = globalConnections.get(connectionKey);
    if (socket) {
      socket.close(1000, "User disconnect");
      globalConnections.delete(connectionKey);
    }
  }, [chatroomId]);

  const sendMessage = useCallback(
    (message: Omit<Message, "sent_at">) => {
      const connectionKey = `room-${chatroomId}`;
      const socket = globalConnections.get(connectionKey);

      if (socket && socket.readyState === WebSocket.OPEN) {
        const messageWithTimestamp = {
          ...message,
          sent_at: new Date().toISOString(),
        };

        try {
          socket.send(JSON.stringify(messageWithTimestamp));

          // SIMULATION: Émettre un événement global pour notifier les autres utilisateurs
          GlobalNotificationsService.emitGlobalMessage({
            senderId: message.sender,
            roomId: message.room,
            content: message.content,
            timestamp: Date.now(),
          }).catch((globalError) => {
            console.error(
              "Erreur lors de l'émission de l'événement global:",
              globalError
            );
          });

          return true;
        } catch (error) {
          console.error("Error sending message:", error);
          return false;
        }
      }
      return false;
    },
    [chatroomId]
  );

  // useEffect avec nettoyage amélioré
  useEffect(() => {
    connect();

    return () => {
      // Ne pas fermer la connexion lors du démontage, juste nettoyer les listeners
      // La connexion sera fermée automatiquement quand plus de composants l'utilisent
    };
  }, [chatroomId, user?.id]);

  return {
    ws: globalConnections.get(`room-${chatroomId}`) || null,
    sendMessage,
    connect,
    disconnect,
    ...state,
  };
}
