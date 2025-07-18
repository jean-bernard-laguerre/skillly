import instance from "./api";
import { Message, Chatroom } from "@/types/interfaces";
import { AxiosError } from "axios";

interface CreateMessagePayload {
  room: string;
  sender: string;
  content: string;
}

export const getMessagesByRoom = async (roomId: string): Promise<Message[]> => {
  try {
    const url = `/messages/room/${roomId}`;
    const response = await instance.get<Message[]>(url);

    // Vérification de la réponse avant d'accéder aux propriétés
    if (!response || response.data === null || response.data === undefined) {
      return [];
    }

    if (!Array.isArray(response.data)) {
      console.error(`❌ [FRONT] Response data is not an array:`, response.data);
      throw new Error("Response data is not an array");
    }

    // Mapping des clés backend -> frontend
    const mappedMessages = response.data.map((msg: any) => ({
      id: msg.ID || msg.id,
      content: msg.Content || msg.content,
      sender: msg.SenderID || msg.sender,
      room: msg.Room || msg.room,
      sent_at: msg.CreatedAt || msg.created_at || msg.sent_at,
    }));

    return mappedMessages;
  } catch (error) {
    console.error("❌ [FRONT] Error fetching messages:", error);

    // Log détaillé de l'erreur
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("❌ [FRONT] Error response:", {
        status: axiosError.response.status,
        data: axiosError.response.data,
        headers: axiosError.response.headers,
      });
    } else if (axiosError.request) {
      console.error("❌ [FRONT] No response received:", axiosError.request);
    } else {
      console.error("❌ [FRONT] Error setting up request:", axiosError.message);
    }

    // Fallback vers mock en cas d'erreur (pour le développement)
    console.log("🔄 [FRONT] Falling back to mock messages due to error");
    const mockMessages: Message[] = [
      {
        sender: "1",
        content: "Bonjour ! Merci pour votre candidature.",
        sent_at: new Date(Date.now() - 3600000).toISOString(),
        room: roomId,
      },
      {
        sender: "2",
        content: "Bonjour ! J'ai hâte de discuter de cette opportunité.",
        sent_at: new Date(Date.now() - 1800000).toISOString(),
        room: roomId,
      },
    ];

    return mockMessages;
  }
};

export const getChatrooms = async (): Promise<Chatroom[]> => {
  try {
    const response = await instance.get("/match/rooms");
    const rooms = response.data;

    // Vérifier que rooms existe et est un tableau
    if (!rooms || !Array.isArray(rooms)) {
      return [];
    }

    // Transformer les rooms en conversations enrichies
    const chatrooms: Chatroom[] = rooms.map((room: any) => ({
      id: room.id.toString(),
      name: room.name || "Conversation",
      created_at: room.created_at,
      participants: room.participants,
      jobPost: room.jobPost,
      lastMessage: room.lastMessage
        ? {
            content: room.lastMessage.content,
            sender: room.lastMessage.sender,
            sent_at: room.lastMessage.sent_at,
          }
        : undefined,
    }));

    return chatrooms;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Si c'est une erreur 401, retourner un tableau vide au lieu de propager l'erreur
    if (axiosError.response?.status === 401) {
      return [];
    }

    console.error("Error fetching chatrooms from /match/rooms:", error);
    throw new Error("Impossible de récupérer les conversations");
  }
};

export const createChatroom = async (payload: {
  matchId: string;
}): Promise<Chatroom> => {
  try {
    console.log("Creating/fetching chatroom for match:", payload.matchId);

    // Dans ce système, la room est créée automatiquement avec le match
    // Cette fonction récupère les infos du match pour créer l'objet chatroom

    // D'abord essayer de récupérer depuis les matches du candidat
    try {
      const matchesResponse = await instance.get("/match/me");
      const matches = matchesResponse.data;
      const match = matches.find(
        (m: any) => m.id.toString() === payload.matchId
      );

      if (match) {
        return {
          id: match.id.toString(),
          name: match.job_post?.title || "Conversation",
          created_at: match.matched_at,
          participants: {
            candidate: match.candidate,
            recruiter: match.job_post?.company,
          },
          jobPost: match.job_post,
        };
      }
    } catch (candidateError) {
      console.log("Not a candidate or match not found in candidate matches");
    }

    // Si pas trouvé, essayer via les applications (pour recruteurs)
    // Cette partie est plus complexe car on doit chercher dans toutes les applications
    throw new Error("Match non trouvé");
  } catch (error) {
    console.error("Error creating/fetching chatroom:", error);
    throw new Error("Impossible de créer la conversation");
  }
};

// Génère dynamiquement l'URL WebSocket selon l'environnement
export function getWebSocketUrl(chatroomId: string, userId?: string) {
  // On part du principe que EXPO_PUBLIC_API_URL = http://192.168.x.x:8080 ou https://...
  const base = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
  // Remplace http(s) par ws(s)
  const wsBase = base.replace(/^http/, "ws");
  // Ajoute l'ID utilisateur si besoin
  return `${wsBase}/ws/${chatroomId}${userId ? `?id=${userId}` : ""}`;
}
