import { useAuth } from "@/context/AuthContext";
import ScreenWrapper from "@/navigation/ScreenWrapper";
import { Pressable, Text, View } from "react-native";

export default function CandidateHome() {
  const { handleLogOut } = useAuth();
  return (
    <ScreenWrapper>
      <View className="flex-1 justify-center items-center">
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
