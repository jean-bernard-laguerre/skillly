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
    if (error.response?.status === 401) {
      // Supprimer le token et les données utilisateur
      await AsyncStorage.multiRemove(["token", "userData", "userRole"]);

      // Pour les requêtes autres que /auth/me, on ne propage pas l'erreur
      // pour éviter qu'elle apparaisse dans l'interface utilisateur
      if (!error.config?.url?.includes("/auth/me")) {
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

      // Pour /auth/me, on laisse l'erreur se propager pour que le contexte d'auth puisse la gérer
    }
    return Promise.reject(error);
  }
);

export default instance;
