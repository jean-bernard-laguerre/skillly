import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useRootNavigationState } from "expo-router";
import { AuthContextType, HandleRedirect, User } from "@/types/interfaces";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  // Utiliser le hook useAuthMutation
  const {
    currentUser,
    isLoadingUser,
    logout: logoutMutation,
  } = useAuthMutation();

  useEffect(() => {
    if (navigationState?.key && !isReady) {
      setIsReady(true);
    }
  }, [navigationState, isReady]);

  const handleRedirect: HandleRedirect = (role) => {
    if (!isReady) return;

    if (role === "candidate") {
      router.replace("/(protected)/candidate");
    } else if (role === "recruiter") {
      router.replace("/(protected)/recruiter");
    } else {
      router.replace("/");
    }
  };

  const handleLogOut = async () => {
    await logoutMutation();
    setRole(null);
    setUser(null);
    handleRedirect(null);
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
