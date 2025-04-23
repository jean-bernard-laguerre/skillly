import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useRootNavigationState } from "expo-router";
import { AuthContextType, HandleRedirect, User } from "@/types/interfaces";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

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
    await AsyncStorage.multiRemove(["userRole", "userData"]);
    setRole(null);
    setUser(null);
    handleRedirect(null);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedRole, storedUser] = await Promise.all([
          AsyncStorage.getItem("userRole"),
          AsyncStorage.getItem("userData"),
        ]);

        if (
          storedRole === "candidate" ||
          storedRole === "recruiter" ||
          storedRole === null
        ) {
          setRole(storedRole);
        } else {
          setRole(null);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur :",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (role && isReady) {
      handleRedirect(role);
    }
  }, [role, isReady]);

  // Fonction pour mettre à jour les données utilisateur
  const updateUser = async (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      await AsyncStorage.setItem("userData", JSON.stringify(newUser));
    } else {
      await AsyncStorage.removeItem("userData");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        user,
        setUser: updateUser,
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
