import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AuthContextType, HandleRedirect } from "@/types/interfaces";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"candidate" | "recruiter" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleRedirect: HandleRedirect = (role) => {
    if (role === "candidate") {
      router.replace("/(protected)/candidate");
    } else if (role === "recruiter") {
      router.replace("/(protected)/recruiter");
    } else {
      router.replace("/");
    }
  };

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("userRole");
    setRole(null);
    handleRedirect(null);
  };

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("userRole");
        if (
          storedRole === "candidate" ||
          storedRole === "recruiter" ||
          storedRole === null
        ) {
          setRole(storedRole);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du rôle :", error);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, []);

  useEffect(() => {
    if (role) {
      handleRedirect(role);
    }
  }, [role]);

  return (
    <AuthContext.Provider value={{ role, setRole, handleLogOut, loading }}>
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
