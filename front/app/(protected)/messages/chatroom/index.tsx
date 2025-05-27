import { View, Text } from "react-native";
import { useAuth } from "@/context/AuthContext";

interface ChatroomProps {
  offerId: string;
  chatroomId: string;
}

export default function Chatroom({
  offerId,
  chatroomId,
}: ChatroomProps & {
  params: { offerId: string; chatroomId: string };
}) {
  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-xl font-bold">
        Chatroom for Offer {offerId} and Chatroom {chatroomId}
      </Text>
      <Text className="text-gray-600">
        This is the chatroom for offer {offerId} and chatroom {chatroomId}.
        Here you can implement the chat functionality.
      </Text>
      <Text className="mt-4 text-gray-500">
        Note: This is a placeholder for the chatroom. You can implement the
        actual chat functionality here.
      </Text>
    </View>
  );  
}