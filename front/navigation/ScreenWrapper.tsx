import React from "react";
import { View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        {
          flex: 1,
          paddingBottom: insets.bottom + 100, // 70px navbar height + 20px margin + 10px extra
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
