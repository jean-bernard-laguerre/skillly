import { useState } from "react";
import ChatroomView from "./components/Chatroom";
import ChatroomItem from "@/components/messages/ChatroomItem";
import MessageItem from "@/components/messages/ChatroomItem";
import { Chatroom } from "@/types/interfaces";
import { View, Text } from "react-native";

const chatrooms: Chatroom[] = [
  {
    id: '1',
    name: "Candidat 1",
    created_at: new Date().toDateString(),
  },
  {
    id: '2',
    name: "Candidat 2",
    created_at: new Date().toDateString(),
  },
  {
    id: '3',
    name: "Candidat 3",
    created_at: new Date().toDateString(),
  }
]

export default function RecruiterMessages() {
  const [selectedChatroom, setSelectedChatroom] = useState('')
  
    const handlePress = (room: Chatroom) => {
      setSelectedChatroom(room.id)
    }
  
    const onBack = () => {
      setSelectedChatroom('')
    }
    if (selectedChatroom) {
      return (
        <ChatroomView
          onBack={onBack}
          chatroomId={selectedChatroom}
        />
      )
    }
  
    return (
      <View className="flex-1 flex-col p-4">
        <Text className="mb-4 text-xl font-bold">Mes conversations</Text>
        <Text className="text-gray-600">
          Vous pourrez ici voir vos conversations avec les candidats
          {chatrooms.map(room => (
            <ChatroomItem
              handlePress={() => {handlePress(room)}}
              key={room.id}
            />
          ))}
        </Text>
      </View>
    );
}
