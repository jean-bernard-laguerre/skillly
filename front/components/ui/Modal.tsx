import React from "react";
import { View, Text, Pressable, Modal as RNModal } from "react-native";
import { X } from "lucide-react-native";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isVisible, onClose, title, children }: ModalProps) => {
  return (
    <RNModal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">{title}</Text>
            <Pressable onPress={onClose}>
              <X size={24} color="#000" />
            </Pressable>
          </View>
          <View className="flex-1 p-4">{children}</View>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;
