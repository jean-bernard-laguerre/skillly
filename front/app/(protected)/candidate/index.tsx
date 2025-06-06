import { View, Text, Pressable } from "react-native";
import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function CandidateHome() {
  const { handleLogOut } = useAuth();
  return (
    <ScreenWrapper>
      <View className="items-center justify-center flex-1">
        <Text className="mb-2 text-2xl font-bold">Espace Candidat 🎯</Text>
        <Text className="text-gray-600">
          Bienvenue sur votre espace candidat
        </Text>
        <Pressable
          className="p-2 mt-5 bg-red-500 rounded-md"
          onPress={() => handleLogOut()}
        >
          <Text className="text-white">Se déconnecter</Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}
