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

export default instance;
