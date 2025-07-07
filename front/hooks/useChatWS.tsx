import { useEffect, useState, useRef, useCallback } from "react";
import { Message } from "@/types/interfaces";
import { useAuth } from "@/context/AuthContext";
import { getWebSocketUrl } from "@/services/message.service";

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export function useChatWS(
  chatroomId: string,
  onMessage: (message: Message) => void,
  onConnect?: () => void,
  onDisconnect?: () => void
) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const { user } = useAuth();
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    if (!chatroomId || !user?.id || isConnectingRef.current) return;

    isConnectingRef.current = true;
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const wsUrl = getWebSocketUrl(chatroomId, user.id.toString());
      console.log("Connecting to WebSocket:", wsUrl);

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established");
        isConnectingRef.current = false;
        setState({
          isConnected: true,
          isConnecting: false,
          error: null,
        });
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      socket.onmessage = (event) => {
        try {
          console.log("WebSocket message received:", event.data);
          const message: Message = JSON.parse(event.data);
          onMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        isConnectingRef.current = false;
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Erreur de connexion WebSocket",
        }));
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        isConnectingRef.current = false;
        setState({
          isConnected: false,
          isConnecting: false,
          error:
            event.code !== 1000
              ? "Connexion fermée de manière inattendue"
              : null,
        });

        onDisconnect?.();

        // Tentative de reconnexion automatique seulement si pas fermé volontairement
        if (
          event.code !== 1000 &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          console.log(
            `Tentative de reconnexion ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 2000 * reconnectAttemptsRef.current) as unknown as number;
        }
      };

      setWs(socket);
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      isConnectingRef.current = false;
      setState({
        isConnected: false,
        isConnecting: false,
        error: "Impossible de créer la connexion WebSocket",
      });
    }
  }, [chatroomId, user?.id, onMessage, onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (ws) {
      ws.close(1000, "User disconnect");
      setWs(null);
    }
  }, [ws]);

  const sendMessage = useCallback(
    (message: Omit<Message, "sent_at">) => {
      if (ws && state.isConnected) {
        const messageWithTimestamp = {
          ...message,
          sent_at: new Date().toISOString(),
        };

        try {
          ws.send(JSON.stringify(messageWithTimestamp));
          return true;
        } catch (error) {
          console.error("Error sending message:", error);
          return false;
        }
      }
      return false;
    },
    [ws, state.isConnected]
  );

  // useEffect avec dépendances stables
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [chatroomId, user?.id]); // Dépendances minimales et stables

  return {
    ws,
    sendMessage,
    connect,
    disconnect,
    ...state,
  };
}
