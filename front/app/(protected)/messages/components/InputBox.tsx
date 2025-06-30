import { View, TouchableOpacity } from "react-native"
import { TextInput, Text } from "react-native";
import { useState } from "react";
import { SendHorizontal } from "lucide-react-native";


interface InputBoxProps {
  readonly value: string;
  readonly onChange: (text: string) => void;
  readonly onSend: () => void;
  readonly placeholder?: string;
  readonly disabled?: boolean;
}

export default function InputBox({
  value,
  onChange,
  onSend,
  placeholder,
  disabled = false,
}: InputBoxProps) {

  return (
    <View className="flex-row items-center p-2 bg-white border-t border-gray-200">
      <TextInput
        className="flex-1 p-2 bg-gray-100 rounded-lg"
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || "Type a message..."}
        editable={!disabled}
      />
      <TouchableOpacity
        className="ml-2 p-2 bg-blue-500 rounded-lg"
        onPress={onSend}
        disabled={disabled}
      >
        <Text className="text-white">
          <SendHorizontal size={20} color="white" />
        </Text>
      </TouchableOpacity>
    </View>
  );
}