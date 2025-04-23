import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/interfaces";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabNavigationProp } from "@/types/navigation";
import { useAuth as useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<TabNavigationProp>();
  const { setUser } = useAuthContext();

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
        setUser(null);
        return null;
      }
      const user = await AuthService.getCurrentUser();
      setUser(user);
      return user;
    },
    retry: false,
  });

  // Mutation pour la connexion
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      try {
        // Invalider les requêtes liées à l'utilisateur
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);

        // Attendre que les données soient bien stockées
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Rediriger en fonction du rôle
        if (data.user.role === "candidate") {
          navigation.navigate("CandidateHome");
        } else if (data.user.role === "recruiter") {
          navigation.navigate("RecruiterHome");
        }
      } catch (error) {
        console.error("Erreur lors de la redirection:", error);
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
    onSuccess: async (data) => {
      try {
        // Invalider les requêtes liées à l'utilisateur
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);

        // Attendre que les données soient bien stockées
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Rediriger vers la page candidat
        navigation.navigate("CandidateHome");
      } catch (error) {
        console.error("Erreur lors de la redirection:", error);
      }
    },
  });

  // Mutation pour l'inscription recruteur
  const {
    mutate: registerRecruiter,
    isPending: isRegisteringRecruiter,
    error: registerRecruiterError,
  } = useMutation({
    mutationFn: AuthService.registerRecruiter,
    onSuccess: async (data) => {
      try {
        // Invalider les requêtes liées à l'utilisateur
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);

        // Attendre que les données soient bien stockées
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Rediriger vers la page recruteur
        navigation.navigate("RecruiterHome");
      } catch (error) {
        console.error("Erreur lors de la redirection:", error);
      }
    },
  });

  // Mutation pour la déconnexion
  const {
    mutate: logout,
    isPending: isLoggingOut,
    error: logoutError,
  } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async () => {
      try {
        // Supprimer toutes les données du cache
        await queryClient.clear();
        setUser(null);

        // Attendre que les données soient bien supprimées
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    },
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
