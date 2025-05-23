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

  // Query simple pour récupérer l'utilisateur courant
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          return null;
        }
        const user = await AuthService.getCurrentUser();
        return user;
      } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem("token");
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
