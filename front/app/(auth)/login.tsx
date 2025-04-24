import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoginCredentials } from "@/types/interfaces";
import { Link } from "expo-router";

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    login(formData);
  };

  const handleQuickLogin = (role: "candidate" | "recruiter") => {
    const testEmail = `${role}@mail.com`;
    const testPassword = "test1234";
    login({ email: testEmail, password: testPassword });
  };

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="mb-4 text-2xl font-bold">Connexion</Text>

      {loginError && (
        <Text className="mb-4 text-red-500">{loginError.message}</Text>
      )}

      <View className="mb-4">
        <Text className="mb-2">Email</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Mot de passe</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />
      </View>

      <Pressable
        className="p-4 mb-4 bg-blue-500 rounded"
        onPress={handleSubmit}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-center text-white">Se connecter</Text>
        )}
      </Pressable>

      <View className="mb-4">
        <Text className="mb-2 text-center text-gray-500">Connexion rapide</Text>
        <View className="flex-row justify-between">
          <Pressable
            className="flex-1 p-3 mr-2 bg-green-500 rounded"
            onPress={() => handleQuickLogin("candidate")}
            disabled={isLoggingIn}
          >
            <Text className="font-medium text-center text-white">
              Candidat Test
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 p-3 ml-2 bg-purple-500 rounded"
            onPress={() => handleQuickLogin("recruiter")}
            disabled={isLoggingIn}
          >
            <Text className="font-medium text-center text-white">
              Recruteur Test
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="flex-row justify-center space-x-2">
        <Text>Pas encore inscrit ?</Text>
        <Link href="/(auth)/signup/candidate" className="text-blue-500">
          Candidat
        </Link>
        <Text>ou</Text>
        <Link href="/(auth)/signup/recruiter" className="text-blue-500">
          Recruteur
        </Link>
      </View>
    </ScrollView>
  );
}
