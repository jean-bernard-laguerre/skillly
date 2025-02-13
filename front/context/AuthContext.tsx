import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type AuthContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
  handleLogOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  interface HandleRedirect {
    (role: string | null): void;
  }

  const handleRedirect: HandleRedirect = (role) => {
    if (role === "candidate") {
      router.replace("/candidate");
    } else if (role === "recruiter") {
      router.replace("/recruiter");
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
        setRole(storedRole);
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
