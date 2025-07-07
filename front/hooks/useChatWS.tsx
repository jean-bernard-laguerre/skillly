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
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    if (!chatroomId || !user?.id || state.isConnecting) return;

    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const wsUrl = getWebSocketUrl(chatroomId, user.id.toString());
      console.log("Connecting to WebSocket:", wsUrl);

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connection established");
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
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Erreur de connexion WebSocket",
        }));
      };

      socket.onclose = (event) => {
        console.log("WebSocket connection closed:", event.code, event.reason);
        setState({
          isConnected: false,
          isConnecting: false,
          error:
            event.code !== 1000
              ? "Connexion fermée de manière inattendue"
              : null,
        });

        onDisconnect?.();

        // Tentative de reconnexion automatique
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
          }, 2000 * reconnectAttemptsRef.current) as unknown as number; // Délai progressif
        }
      };

      setWs(socket);
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setState({
        isConnected: false,
        isConnecting: false,
        error: "Impossible de créer la connexion WebSocket",
      });
    }
  }, [
    chatroomId,
    user?.id,
    onMessage,
    onConnect,
    onDisconnect,
    state.isConnecting,
  ]);

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

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ws,
    sendMessage,
    connect,
    disconnect,
    ...state,
  };
}
