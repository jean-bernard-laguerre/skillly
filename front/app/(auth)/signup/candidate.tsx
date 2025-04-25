import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";
import { RegisterCredentials } from "@/types/interfaces";

export default function CandidateSignup() {
  const { registerCandidate, isRegisteringCandidate, registerCandidateError } =
    useAuthMutation();
  const [formData, setFormData] = useState<RegisterCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    bio: "",
    experienceYears: 0,
    preferedContract: "CDI",
    preferedJob: "",
    location: "",
    availability: "",
    resumeID: 0,
    certifications: [],
    skills: [],
  });

  const handleSubmit = () => {
    registerCandidate(formData);
  };

  return (
    <ScrollView className="flex-1">
      <Text className="mb-4 text-2xl font-bold">Inscription Candidat</Text>

      {registerCandidateError && (
        <Text className="mb-4 text-red-500">
          {registerCandidateError.message}
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
        <Text className="mb-2">Bio</Text>
        <TextInput
          className="h-20 p-2 border rounded"
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          multiline
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Années d'expérience</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.experienceYears?.toString() || "0"}
          onChangeText={(text) =>
            setFormData({ ...formData, experienceYears: parseInt(text) || 0 })
          }
          keyboardType="numeric"
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Type de contrat préféré</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.preferedContract}
          onChangeText={(text) =>
            setFormData({ ...formData, preferedContract: text })
          }
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Poste recherché</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.preferedJob}
          onChangeText={(text) =>
            setFormData({ ...formData, preferedJob: text })
          }
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Localisation</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
        />
      </View>

      <View className="mb-4">
        <Text className="mb-2">Disponibilité</Text>
        <TextInput
          className="p-2 border rounded"
          value={formData.availability}
          onChangeText={(text) =>
            setFormData({ ...formData, availability: text })
          }
        />
      </View>

      <Pressable
        className="p-4 bg-blue-500 rounded"
        onPress={handleSubmit}
        disabled={isRegisteringCandidate}
      >
        <Text className="text-center text-white">
          {isRegisteringCandidate ? "Inscription en cours..." : "S'inscrire"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
