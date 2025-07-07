import { AxiosError } from "axios";
import instance from "./api";
import { Message, Chatroom } from "@/types/interfaces";

interface CreateMessagePayload {
  room: string;
  sender: string;
  content: string;
}

export const getMessagesByRoom = async (roomId: string): Promise<Message[]> => {
  try {
    const response = await instance.get<Message[]>(`/messages/room/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    const axiosError = error as AxiosError;
    console.error("Erreur détaillée:", {
      message: axiosError.message,
      response: axiosError.response
        ? {
            status: axiosError.response.status,
            data: axiosError.response.data,
          }
        : "Pas de réponse du serveur",
      config: axiosError.config,
    });
    throw error;
  }
};

export const getChatrooms = async (): Promise<Chatroom[]> => {
  try {
    const response = await instance.get<Chatroom[]>("/chatrooms/me");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    const axiosError = error as AxiosError;
    console.error("Erreur détaillée:", {
      message: axiosError.message,
      response: axiosError.response
        ? {
            status: axiosError.response.status,
            data: axiosError.response.data,
          }
        : "Pas de réponse du serveur",
      config: axiosError.config,
    });
    throw error;
  }
};

export const createChatroom = async (payload: {
  name: string;
  participantId: string;
}): Promise<Chatroom> => {
  try {
    const response = await instance.post<Chatroom>("/chatrooms", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la conversation:", error);
    const axiosError = error as AxiosError;
    console.error("Erreur détaillée:", {
      message: axiosError.message,
      response: axiosError.response
        ? {
            status: axiosError.response.status,
            data: axiosError.response.data,
          }
        : "Pas de réponse du serveur",
      config: axiosError.config,
    });
    throw error;
  }
};

// Fonction utilitaire pour créer une URL WebSocket
export const getWebSocketUrl = (roomId: string, userId: string): string => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
  // Convertir http/https en ws/wss
  const wsUrl = apiUrl.replace(/^http/, "ws");
  return `${wsUrl}/ws/${roomId}?id=${userId}`;
};
