import { useEffect, useState } from "react";
import { Redirect, useRootNavigationState } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TabNavigationProp } from "../types/navigation";

export default function HomePage() {
  const { role, loading } = useAuth();
  const navigationState = useRootNavigationState();
  const [isReady, setIsReady] = useState(false);
  const navigation = useNavigation<TabNavigationProp>();

  useEffect(() => {
    if (navigationState?.key && !isReady) {
      setIsReady(true);
    }
  }, [navigationState, isReady]);

  if (!isReady || loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="items-center justify-center flex-1">
      <Text className="mb-5 text-2xl font-bold">Bienvenue sur Skillly 🚀</Text>
      <Text className="mb-10 text-base text-center">
        La plateforme qui connecte candidats et recruteurs en un instant.
      </Text>
      <Pressable
        className="px-5 py-3 mb-3 bg-blue-500 rounded-lg active:bg-blue-700"
        onPress={() => navigation.navigate("Login")}
      >
        <Text className="text-base font-semibold text-white">Se connecter</Text>
      </Pressable>
      <Pressable
        className="px-5 py-3 bg-blue-500 rounded-lg active:bg-blue-700"
        onPress={() => navigation.navigate("Register")}
      >
        <Text className="text-base font-semibold text-white">
          Créer un compte
        </Text>
      </Pressable>
    </View>
  );
}
