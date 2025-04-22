import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useAuth } from "@/lib/hooks/useAuth";
import { RegisterCredentials } from "@/types/interfaces";

export default function RecruiterSignup() {
  const { registerRecruiter, isRegisteringRecruiter, registerRecruiterError } =
    useAuth();
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    title: "",
    company: 0,
    newCompany: undefined,
  });

  const handleSubmit = () => {
    registerRecruiter(formData);
  };

  return (
    <ScrollView className="flex-1">
      <Text className="mb-4 text-2xl font-bold">Inscription Recruteur</Text>

      {registerRecruiterError && (
        <Text className="mb-4 text-red-500">
          {registerRecruiterError.message}
        </Text>
      )}

      <View className="mb-4">
        <Text className="mb-2">Prénom</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Nom</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />
      </View>

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

      <View className="mb-4">
        <Text className="mb-2">Titre</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">ID de l'entreprise</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.company?.toString() || "0"}
          onChangeText={(text) =>
            setFormData({ ...formData, company: parseInt(text) || 0 })
          }
          keyboardType="numeric"
        />
      </View>

      <Pressable
        className="p-4 bg-blue-500 rounded"
        onPress={handleSubmit}
        disabled={isRegisteringRecruiter}
      >
        <Text className="text-center text-white">
          {isRegisteringRecruiter ? "Inscription en cours..." : "S'inscrire"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
