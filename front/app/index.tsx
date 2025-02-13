import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState, Link } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, Text, Button, ActivityIndicator } from "react-native";

export default function HomePage() {
  const { role, loading } = useAuth();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationState?.key && !isReady) {
      setIsReady(true);
    }
  }, [navigationState, isReady]);

  if (!isReady || loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Bienvenue sur Skillly 🚀
      </Text>
      <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 40 }}>
        La plateforme qui connecte candidats et recruteurs en un instant.
      </Text>
      <Link href="/auth/login">
        <Text style={{ color: "#007bff", marginBottom: 10 }}>Se connecter</Text>
      </Link>
      <View style={{ height: 10 }} />
      <Link href="/auth/register">
        <Text style={{ color: "#007bff" }}>Créer un compte</Text>
      </Link>
    </View>
  );
}
