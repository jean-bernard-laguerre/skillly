import React from "react";
import { View, Text, Pressable } from "react-native";
import { Bell } from "lucide-react-native";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export default function Header({
  title,
  subtitle,
  showNotification = false,
  onNotificationPress,
}: HeaderProps) {
  return (
    <View
      className="px-6 pt-4 pb-2 bg-[#F7F7F7]"
      style={{ minHeight: subtitle ? 80 : 60 }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text
            className="font-black text-left text-black"
            style={{
              fontSize: 32,
              fontWeight: "900",
              paddingBottom: 2,
              paddingTop: 0,
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="mt-1 text-sm text-gray-600">{subtitle}</Text>
          )}
        </View>

        {showNotification && (
          <Pressable onPress={onNotificationPress} className="p-2">
            <Bell size={24} color="#6366f1" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
