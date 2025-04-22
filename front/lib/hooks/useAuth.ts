import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/interfaces";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Mutation pour la connexion
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Invalider les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Rediriger en fonction du rôle
      if (data.user.role === "candidate") {
        router.replace("/(protected)/candidate");
      } else if (data.user.role === "recruiter") {
        router.replace("/(protected)/recruiter");
      }
    },
  });

  // Mutation pour l'inscription candidat
  const {
    mutate: registerCandidate,
    isPending: isRegisteringCandidate,
    error: registerCandidateError,
  } = useMutation({
    mutationFn: AuthService.registerCandidate,
    onSuccess: (data) => {
      // Invalider les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Rediriger vers la page candidat
      router.replace("/(protected)/candidate");
    },
  });

  // Mutation pour l'inscription recruteur
  const {
    mutate: registerRecruiter,
    isPending: isRegisteringRecruiter,
    error: registerRecruiterError,
  } = useMutation({
    mutationFn: AuthService.registerRecruiter,
    onSuccess: (data) => {
      // Invalider les requêtes liées à l'utilisateur
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      // Rediriger vers la page recruteur
      router.replace("/(protected)/recruiter");
    },
  });

  // Mutation pour la déconnexion
  const {
    mutate: logout,
    isPending: isLoggingOut,
    error: logoutError,
  } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      // Supprimer toutes les données du cache
      queryClient.clear();
      // Rediriger vers la page d'accueil
      router.replace("/");
    },
  });

  // Query pour récupérer l'utilisateur courant
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return null;
      }
      return AuthService.getCurrentUser();
    },
    retry: false,
    enabled: false, // Désactive l'exécution automatique
  });

  // Mutation pour rafraîchir le token
  const { mutate: refreshToken, error: refreshError } = useMutation({
    mutationFn: AuthService.refreshToken,
    onSuccess: (token) => {
      // Mettre à jour le token dans le cache
      queryClient.setQueryData(["token"], token);
    },
  });

  return {
    // Données
    currentUser,
    isLoadingUser,

    // Mutations
    login,
    isLoggingIn,
    registerCandidate,
    isRegisteringCandidate,
    registerRecruiter,
    isRegisteringRecruiter,
    logout,
    isLoggingOut,
    refreshToken,

    // États dérivés
    isAuthenticated: !!currentUser,
    role: currentUser?.role,

    // Erreurs
    loginError,
    registerCandidateError,
    registerRecruiterError,
    logoutError,
    userError,
    refreshError,
  };
};
