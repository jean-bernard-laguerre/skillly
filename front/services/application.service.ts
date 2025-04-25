import { AxiosError } from "axios";
import instance from "./api";
import { Application } from "@/types/interfaces";

export const getMyApplications = async (): Promise<Application[]> => {
  try {
    const response = await instance.get<Application[]>(
      "/application/me?populate=JobPost"
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    throw error;
  }
};

export const createApplication = async (
  jobOfferId: string,
  score: number
): Promise<Application> => {
  try {
    const response = await instance.post<Application>(
      `/application/${jobOfferId}`,
      {
        Score: score,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la candidature:", error);
    throw error;
  }
};

export const updateApplicationState = async (
  applicationId: string,
  state: "pending" | "matched" | "rejected" | "accepted"
): Promise<{ message: string }> => {
  try {
    const response = await instance.put<{ message: string }>(
      `/application/${applicationId}/state`,
      {
        state: state,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la candidature:",
      error
    );
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
