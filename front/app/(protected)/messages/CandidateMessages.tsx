import ChatroomItem from "@/components/messages/ChatroomItem";
import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";

export default function CandidateMessages() {

  const navigation = useNavigation<StackNavigationProp<any>>();
  const handlePress = () => {
    navigation.navigate("chatroom", {
      offerId: "1",
      chatId: "1",
    });
  }

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold">Mes conversations</Text>
      <Text className="text-gray-600">
        Vous pourrez ici voir vos conversations avec les recruteurs
        <ChatroomItem 
          handlePress={handlePress} 
        />
      </Text>
    </View>
  );
}
