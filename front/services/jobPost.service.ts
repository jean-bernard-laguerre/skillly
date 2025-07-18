import { AxiosError } from "axios";
import instance from "./api";
import { JobPost, CreateJobPostDTO } from "@/types/interfaces";

export const getCompanyJobPosts = async (): Promise<JobPost[]> => {
  try {
    const response = await instance.get<JobPost[]>(
      "/jobpost/company?populate=Skills&populate=Certifications"
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des offres d'emploi:", error);
    throw error;
  }
};

export const createJobPost = async (
  jobPost: CreateJobPostDTO
): Promise<JobPost> => {
  try {
    const response = await instance.post<JobPost>("/jobpost", jobPost);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'offre d'emploi:", error);
    const axiosError = error as AxiosError;
    console.error("Erreur détaillée lors de la création de l'offre d'emploi:", {
      message: axiosError.message,
      response: axiosError.response
        ? {
            status: axiosError.response.status,
            data: axiosError.response.data,
          }
        : "Pas de réponse du serveur",
      request: axiosError.request
        ? "Requête envoyée mais pas de réponse"
        : "Pas de requête envoyée",
      config: {
        url: axiosError.config?.url,
        method: axiosError.config?.method,
        baseURL: axiosError.config?.baseURL,
      },
    });
    throw error;
  }
};

export const getCompanyApplications = async (): Promise<JobPost[]> => {
  try {
    const response = await instance.get<JobPost[]>(
      "/jobpost/company?populate=Applications&populate=Applications.Candidate&populate=Applications.Candidate.Skills&populate=Applications.Candidate.Certifications&populate=Applications.Candidate.User&populate=Applications.Candidate.User.ProfileCandidate&populate=Company&populate=Skills&populate=Certifications&populate=Applications.JobPost&populate=Applications.JobPost.Skills&populate=Applications.JobPost.Certifications"
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    throw error;
  }
};

export const getCompanyMatches = async (): Promise<JobPost[]> => {
  try {
    const response = await instance.get<JobPost[]>(
      "/jobpost/company?populate=Skills&populate=Certifications&populate=Matches&populate=Applications&populate=Matches.Candidate&populate=Matches.Candidate.User&populate=Matches.Candidate.Skills&populate=Matches.Candidate.Certifications"
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des matches:", error);
    throw error;
  }
};

export const getCandidateJobPosts = async (): Promise<JobPost[]> => {
  try {
    const response = await instance.get<JobPost[]>(
      "/jobpost/candidate?populate=Skills&populate=Certifications&populate=Company"
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des offres d'emploi:", error);
    throw error;
  }
};
