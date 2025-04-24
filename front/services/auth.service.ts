import instance from "./api";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    console.log("Tentative de connexion avec les identifiants:", {
      email: credentials.email,
      password: "***", // On ne log pas le mot de passe pour des raisons de sécurité
    });

    const response = await instance.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    const { token, user } = response.data;

    console.log("Connexion réussie, données reçues:", {
      token: token ? "présent" : "absent",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    // Stocker le token et les données utilisateur
    await AsyncStorage.multiSet([
      ["token", token],
      ["userData", JSON.stringify(user)],
      ["userRole", user.role],
    ]);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Erreur détaillée lors de la connexion:", {
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

export const registerCandidate = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  try {
    const response = await instance.post<AuthResponse>(
      "/auth/signup/candidate",
      credentials
    );
    const { token, user } = response.data;

    // Stocker le token et les données utilisateur
    await AsyncStorage.multiSet([
      ["token", token],
      ["userData", JSON.stringify(user)],
      ["userRole", user.role],
    ]);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription du candidat:", error);
    throw error;
  }
};

export const registerRecruiter = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  try {
    const response = await instance.post<AuthResponse>(
      "/auth/signup/recruiter",
      credentials
    );
    const { token, user } = response.data;

    // Stocker le token et les données utilisateur
    await AsyncStorage.multiSet([
      ["token", token],
      ["userData", JSON.stringify(user)],
      ["userRole", user.role],
    ]);

    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'inscription du recruteur:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Supprimer les données de l'utilisateur
    await AsyncStorage.multiRemove(["token", "userData", "userRole"]);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await instance.post<{ token: string }>("/auth/refresh");
    const { token } = response.data;

    // Mettre à jour le token
    await AsyncStorage.setItem("token", token);

    return token;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement du token:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  try {
    console.log("Tentative de récupération de l'utilisateur courant");
    const token = await AsyncStorage.getItem("token");
    console.log("Token présent:", !!token);

    const response = await instance.get<AuthResponse["user"]>("/auth/me");
    console.log("Utilisateur récupéré avec succès:", {
      id: response.data.id,
      email: response.data.email,
      role: response.data.role,
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      "Erreur détaillée lors de la récupération de l'utilisateur:",
      {
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
      }
    );
    throw error;
  }
};
