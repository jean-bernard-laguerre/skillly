import { useEffect, useState } from "react";
import { Message } from "@/types/interfaces";

export function useChatWS(chatroomId: string, onMessage: (message: any) => void) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!chatroomId) return;

    const socket = new WebSocket(`${process.env.EXPO_PUBLIC_API_URL}/ws/${chatroomId}`);
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      console.log("WebSocket message received:", event);
      const message: Message = JSON.parse(event.data);
      onMessage(message);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      socket.close();
      setWs(null);
    };
  }, []);

  return ws;
}