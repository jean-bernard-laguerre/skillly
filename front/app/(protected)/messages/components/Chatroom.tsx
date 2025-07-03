import { View, Text, Pressable, KeyboardAvoidingView, ScrollView } from "react-native";

import { ArrowLeft } from "lucide-react-native";
import { Chatroom } from "@/types/interfaces";
import { useEffect, useState } from "react";
import InputBox from "./InputBox";
import MessageBox from "./MessageBox";
import { Message } from "@/types/interfaces";
import { useAuth } from "@/context/AuthContext";
import { useChatWS } from "@/hooks/useChatWS";

interface ChatroomProps {
  readonly onBack: () => void
  readonly chatroomId: string
}

const mockMessages: Message[] = [
  
];

export default function ChatroomView({
  onBack, chatroomId
}: ChatroomProps) {

  const [chatroom, setChatroom] = useState<Chatroom>()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();

  const ws = useChatWS(chatroomId, (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      content: newMessage,
      sender: user?.id.toString() || '',
      sent_at: new Date().toISOString(),
      room: chatroomId,
    };
    if (ws) {
      ws.send(JSON.stringify(message));
      setNewMessage("");
    }
  }


  return (
    <View className="flex-1 p-4">
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-4 flex-row items-center">
          <ArrowLeft size={24} color="#6366f1" />
          <Text className="text-blue-500 ml-4">Retour</Text>
        </Pressable>
        <Text className="text-xl font-semibold">
          {chatroom?.name}
        </Text>
      </View>
      <View className="flex-1">
        <ScrollView className="flex-1 bg-gray-50 p-4 rounded-lg">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageBox
                key={`message-${message.sender}-${message.sent_at}-${index}`}
                message={message}
                isSender={message.sender === user?.id.toString()}
              />
            ))
          ) : (
            <Text className="text-gray-400">Aucun message pour le moment.</Text>
          )}
        </ScrollView>
      </View>
      <KeyboardAvoidingView behavior="padding">
        <InputBox
          value={newMessage}
          onChange={setNewMessage}
          onSend={() => {
            handleSendMessage();
          }}
          placeholder="Type your message here..."
          disabled={false}
        />
      </KeyboardAvoidingView>
    </View>
  );  
}