import { View, Text, TouchableOpacity } from "react-native";

interface ChatroomItemProps {
  handlePress?: () => void;
}

export default function ChatroomItem({
  handlePress = () => {},
}: ChatroomItemProps) {

  return (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200 bg-gray-50"
      onPress={handlePress}
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold">Nom de l'offre</Text>
        <Text className="text-gray-600">Dernier message envoyé</Text>
      </View>
      <View className="ml-4">
        <Text className="text-sm text-gray-500">12:34</Text>
      </View>
    </TouchableOpacity>
  )
}