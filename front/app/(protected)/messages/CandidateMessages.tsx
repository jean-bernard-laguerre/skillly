import { View, Text } from "react-native";

export default function CandidateMessages() {
  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold">Mes conversations</Text>
      <Text className="text-gray-600">
        Vous pourrez ici voir vos conversations avec les recruteurs
      </Text>
    </View>
  );
}
