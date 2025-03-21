import { View, Text } from "react-native";

export default function RecruiterMessages() {
  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold">
        Conversations avec les candidats
      </Text>
      <Text className="text-gray-600">
        Vous pourrez ici gérer vos conversations avec les candidats
      </Text>
    </View>
  );
}
