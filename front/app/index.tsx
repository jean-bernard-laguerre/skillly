import ScreenWrapper from "@/navigation/ScreenWrapper";
import { TabNavigationProp } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { role, loading } = useAuth();
  const navigation = useNavigation<TabNavigationProp>();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center">
        <Text className="mb-5 text-2xl font-bold">
          Bienvenue sur Skillly 🚀
        </Text>
        <Text className="mb-10 text-base text-center">
          La plateforme qui connecte candidats et recruteurs en un instant.
        </Text>
        <Pressable
          className="px-5 py-3 mb-3 bg-blue-500 rounded-lg active:bg-blue-700"
          onPress={() => navigation.navigate("Login")}
        >
          <Text className="text-base font-semibold text-white">
            Se connecter
          </Text>
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
    </ScreenWrapper>
  );
}
