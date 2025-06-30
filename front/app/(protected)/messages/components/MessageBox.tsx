import { Message } from '@/types/interfaces';
import { View, Text } from 'react-native';

interface MessageBoxProps {
  readonly isSender: boolean;
  readonly message: Message;
}
export default function MessageBox({ isSender, message }: MessageBoxProps) {
  return (
    <View
      className={`p-3 rounded-lg mb-2 ${isSender ? 'bg-blue-100' : 'bg-gray-100'}`}
      style={{ alignSelf: isSender ? 'flex-end' : 'flex-start' }}
    >
      <Text className="text-sm text-gray-700">{message.content}</Text>
      <Text className="text-xs text-gray-500 mt-1">{message.sent_at}</Text>
    </View>
  );
}