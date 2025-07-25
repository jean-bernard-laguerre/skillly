// services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
console.log("API_BASE_URL", API_BASE_URL);
const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Ajout automatique du token à chaque requête
instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse pour gérer les erreurs d'authentification
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Gestion des erreurs 401 (non autorisé)
    if (error.response?.status === 401) {
      // Supprimer le token et les données utilisateur
      await AsyncStorage.multiRemove(["token", "userData", "userRole"]);

      // Pour les requêtes autres que /auth/me et /auth/login, on ne propage pas l'erreur
      // pour éviter qu'elle apparaisse dans l'interface utilisateur
      if (
        !error.config?.url?.includes("/auth/me") &&
        !error.config?.url?.includes("/auth/login")
      ) {
        // Retourner une réponse vide pour éviter l'erreur dans l'UI
        return Promise.resolve({
          data: null,
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
          request: error.request,
        });
      }
    }

    // Pour toutes les autres erreurs, les propager normalement
    return Promise.reject(error);
  }
);

export default instance;
