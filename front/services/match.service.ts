import { AxiosError } from "axios";
import instance from "./api";
import { Match } from "@/types/interfaces";

interface CreateMatchPayload {
  candidate_id: number;
  job_post_id: number;
  application_id: number;
}

export const createMatch = async (
  payload: CreateMatchPayload
): Promise<Match> => {
  try {
    const response = await instance.post<Match>("/match", payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du match:", error);
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

// Add other match service functions here if needed (e.g., getMatches, deleteMatch)
