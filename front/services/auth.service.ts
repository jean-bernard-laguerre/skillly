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
    const response = await instance.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Vérifier que response.data existe et contient les données attendues
    if (!response.data || !response.data.token || !response.data.user) {
      throw new Error("Réponse invalide du serveur");
    }

    const { token, user } = response.data;

    // Stocker le token et les données utilisateur
    await AsyncStorage.multiSet([
      ["token", token],
      ["userData", JSON.stringify(user)],
      ["userRole", user.role],
    ]);

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Gestion simplifiée des erreurs
    if (axiosError.response?.status === 401) {
      throw new Error("Identifiants incorrects");
    } else if (axiosError.response?.status === 400) {
      throw new Error("Données invalides");
    } else if (axiosError.response?.status === 500) {
      throw new Error("Erreur serveur");
    } else {
      throw new Error("Erreur de connexion");
    }
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
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 409) {
      throw new Error("Email déjà utilisé");
    } else if (axiosError.response?.status === 400) {
      throw new Error("Données invalides");
    } else {
      throw new Error("Erreur lors de l'inscription");
    }
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
    const axiosError = error as AxiosError;

    if (axiosError.response?.status === 409) {
      throw new Error("Email déjà utilisé");
    } else if (axiosError.response?.status === 400) {
      throw new Error("Données invalides");
    } else {
      throw new Error("Erreur lors de l'inscription");
    }
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

export const getCurrentUser = async (): Promise<
  AuthResponse["user"] | null
> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Aucun token trouvé");
    }

    const response = await instance.get<AuthResponse["user"]>("/auth/me");

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    // Si c'est une erreur 401, ne pas la propager et retourner null
    if (axiosError.response?.status === 401) {
      return null;
    }

    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    throw error;
  }
};
