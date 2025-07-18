import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthService from "@/services/auth.service";
import * as UserService from "@/services/user.service";
import {
  LoginCredentials,
  RegisterCredentials,
  User,
} from "@/types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthMutation = () => {
  const queryClient = useQueryClient();

  // Mutation pour ajouter des compétences/certifications
  const { mutate: addUserSkillsMutation, isPending: isAddingSkills } =
    useMutation({
      mutationFn: ({ userId, payload }: { userId: number; payload: any }) =>
        UserService.addUserSkills(userId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });

  // Mutation pour supprimer une compétence
  const { mutate: deleteUserSkillMutation, isPending: isDeletingSkill } =
    useMutation({
      mutationFn: ({ userId, payload }: { userId: number; payload: any }) =>
        UserService.deleteUserSkill(userId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });

  // Mutation pour la connexion (avec callback optionnel pour navigation)
  const {
    mutate: login,
    isPending: isLoggingIn,
    error: loginError,
  } = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      try {
        // Forcer le refetch de la query currentUser pour mettre à jour le contexte
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        await queryClient.refetchQueries({ queryKey: ["currentUser"] });

        // La navigation sera gérée par le TabNavigator automatiquement
        // quand le rôle changera dans AuthProvider
      } catch (error) {
        console.error("Erreur lors de la mise à jour du cache:", error);
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
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        // La navigation sera gérée par le TabNavigator automatiquement
      } catch (error) {
        console.error("Erreur lors de la mise à jour du cache:", error);
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
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        // La navigation sera gérée par le TabNavigator automatiquement
      } catch (error) {
        console.error("Erreur lors de la mise à jour du cache:", error);
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
        await queryClient.clear();
        await AsyncStorage.removeItem("token");
        // La navigation sera gérée par le TabNavigator automatiquement
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
      }
    },
  });

  // Mutation pour rafraîchir le token
  const { mutate: refreshToken, error: refreshError } = useMutation({
    mutationFn: AuthService.refreshToken,
    onSuccess: (token) => {
      queryClient.setQueryData(["token"], token);
    },
  });

  return {
    // Mutations Auth
    login,
    isLoggingIn,
    registerCandidate,
    isRegisteringCandidate,
    registerRecruiter,
    isRegisteringRecruiter,
    logout,
    isLoggingOut,

    // Mutations Profil
    addUserSkillsMutation,
    isAddingSkills,
    deleteUserSkillMutation,
    isDeletingSkill,

    // Erreurs
    loginError,
    registerCandidateError,
    registerRecruiterError,
    logoutError,
    refreshError,
  };
};
