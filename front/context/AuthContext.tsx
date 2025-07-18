import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, User } from "@/types/interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as AuthService from "@/services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fonction pour déconnecter automatiquement l'utilisateur
  const handleAutoLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "userData", "userRole"]);
      await queryClient.clear();
      setRole(null);
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion automatique:", error);
    }
  };

  // Query simple pour récupérer l'utilisateur courant
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          return null;
        }
        const user = await AuthService.getCurrentUser();

        // Si la réponse est null (token invalide intercepté), déconnecter
        if (!user) {
          await handleAutoLogout();
          return null;
        }

        return user;
      } catch (error: any) {
        // Si c'est une erreur 401, déconnecter automatiquement sans log d'erreur
        if (error?.response?.status === 401) {
          await handleAutoLogout();
          return null; // Retourner null pour indiquer qu'il n'y a pas d'utilisateur connecté
        }

        // Pour les autres erreurs, on peut les logger
        console.error("Error fetching current user:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 0, // Toujours considérer comme stale pour forcer le refetch
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const handleLogOut = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "userData", "userRole"]);
      await queryClient.clear();
      setRole(null);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Synchroniser l'état du contexte avec les données de TanStack Query
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      setRole(currentUser.role);
    } else {
      setUser(null);
      setRole(null);
    }
  }, [currentUser]);

  // Gérer le chargement
  useEffect(() => {
    setLoading(isLoadingUser);
  }, [isLoadingUser]);

  // Vérifier périodiquement si un token est disponible et forcer le refetch si nécessaire
  useEffect(() => {
    const checkTokenAndRefetch = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token && !currentUser) {
        queryClient.refetchQueries({ queryKey: ["currentUser"] });
      }
    };

    // Vérifier immédiatement
    checkTokenAndRefetch();

    // Vérifier périodiquement (toutes les 2 secondes)
    const interval = setInterval(checkTokenAndRefetch, 2000);

    return () => clearInterval(interval);
  }, [currentUser, queryClient]);

  // Gérer les erreurs d'authentification
  useEffect(() => {
    if (error) {
      // L'erreur est déjà gérée dans queryFn, mais on peut ajouter une logique supplémentaire ici si nécessaire
    }
  }, [error]);

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser,
        handleLogOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
