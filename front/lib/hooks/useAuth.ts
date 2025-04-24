import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthService from "@/services/auth.service";
import * as UserService from "@/services/user.service";
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
    refetch: refetchCurrentUser,
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
      mutationFn: ({ userId, skillId }: { userId: number; skillId: number }) =>
        UserService.deleteUserSkill(userId, skillId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      },
    });

  // Mutation pour supprimer une certification
  const {
    mutate: deleteUserCertificationMutation,
    isPending: isDeletingCertification,
  } = useMutation({
    mutationFn: ({
      userId,
      certificationId,
    }: {
      userId: number;
      certificationId: number;
    }) => UserService.deleteUserCertification(userId, certificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
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
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);
        await new Promise((resolve) => setTimeout(resolve, 300));
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
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);
        await new Promise((resolve) => setTimeout(resolve, 300));
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
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setUser(data.user);
        await new Promise((resolve) => setTimeout(resolve, 300));
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
        await queryClient.clear();
        setUser(null);
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
      queryClient.setQueryData(["token"], token);
    },
  });

  return {
    // Données
    currentUser,
    isLoadingUser,

    // Mutations Auth
    login,
    isLoggingIn,
    registerCandidate,
    isRegisteringCandidate,
    registerRecruiter,
    isRegisteringRecruiter,
    logout,
    isLoggingOut,

    // Mutations Profil (ajoutées)
    addUserSkillsMutation,
    isAddingSkills,
    deleteUserSkillMutation,
    isDeletingSkill,
    deleteUserCertificationMutation,
    isDeletingCertification,

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
