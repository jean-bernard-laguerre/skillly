import { View, Text, Pressable } from "react-native";
import { useAuthMutation } from "@/lib/hooks/useAuthMutation";

export default function CandidateHome() {
  const { logout } = useAuthMutation();
  return (
    <View className="items-center justify-center flex-1">
      <Text className="mb-2 text-2xl font-bold">Espace Candidat 🎯</Text>
      <Text className="text-gray-600">Bienvenue sur votre espace candidat</Text>
      <Pressable
        className="p-2 mt-5 bg-red-500 rounded-md"
        onPress={() => logout()}
      >
        <Text className="text-white">Se déconnecter</Text>
      </Pressable>
    </View>
  );
}
