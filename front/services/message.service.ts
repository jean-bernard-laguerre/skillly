import instance from "./api";
import { Message, Chatroom } from "@/types/interfaces";

interface CreateMessagePayload {
  room: string;
  sender: string;
  content: string;
}

export const getMessagesByRoom = async (roomId: string): Promise<Message[]> => {
  try {
    console.log(`Fetching messages for room: ${roomId}`);

    // TODO: Adapter quand l'endpoint sera disponible
    // const response = await instance.get<Message[]>(`/messages/room/${roomId}`);

    // Mock pour le développement
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
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error("Impossible de récupérer les messages");
  }
};

export const getChatrooms = async (): Promise<Chatroom[]> => {
  try {
    console.log("Fetching chatrooms from matches...");

    // Récupérer les matches selon le rôle de l'utilisateur
    // Pour les candidats: GET /match/me
    // Pour les recruteurs: utiliser les applications avec état "matched"
    let matches: any[] = [];

    try {
      // Essayer d'abord l'endpoint candidat
      const candidateResponse = await instance.get("/match/me");
      matches = candidateResponse.data;
      console.log(`Found ${matches.length} matches for candidate`);
    } catch (candidateError: any) {
      // Si échec (probablement un recruteur), essayer via les applications
      console.log("Not a candidate, trying recruiter approach...");

      try {
        // Pour les recruteurs, on peut récupérer les applications avec état "matched"
        // via l'endpoint /application/jobpost/{id} pour chaque offre
        // Mais on va d'abord essayer de récupérer via les offres de l'entreprise
        const jobPostsResponse = await instance.get("/jobpost/company");
        const jobPosts = jobPostsResponse.data;

        // Récupérer toutes les applications matchées pour chaque offre
        const matchedApplicationsPromises = jobPosts.map(
          async (jobPost: any) => {
            try {
              const applicationsResponse = await instance.get(
                `/application/jobpost/${jobPost.id}`
              );
              const applications = applicationsResponse.data;

              // Filtrer les applications avec état "matched"
              return applications
                .filter((app: any) => app.state === "matched")
                .map((app: any) => ({
                  id: app.id, // Utiliser l'ID de l'application comme ID du match temporaire
                  candidate: app.candidate,
                  job_post: jobPost,
                  matched_at: app.updated_at || app.created_at,
                  application: app,
                }));
            } catch (error) {
              console.error(
                `Error fetching applications for job ${jobPost.id}:`,
                error
              );
              return [];
            }
          }
        );

        const allMatchedApplications = await Promise.all(
          matchedApplicationsPromises
        );
        matches = allMatchedApplications.flat();
        console.log(`Found ${matches.length} matches for recruiter`);
      } catch (recruiterError) {
        console.error("Failed to fetch matches for recruiter:", recruiterError);
        throw new Error("Impossible de récupérer les conversations");
      }
    }

    // Transformer les matches en conversations
    const chatrooms: Chatroom[] = matches.map((match: any) => ({
      id: match.id.toString(), // Room ID = Match ID (ou Application ID pour recruteurs)
      name: match.job_post?.title || "Conversation", // Nom = Titre de l'offre
      created_at: match.matched_at, // Date de création = Date du match
      participants: {
        candidate: match.candidate,
        recruiter: match.job_post?.company,
      },
      jobPost: match.job_post,
    }));

    console.log(`Transformed ${chatrooms.length} matches into chatrooms`);
    return chatrooms;
  } catch (error) {
    console.error("Error fetching chatrooms from matches:", error);
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
