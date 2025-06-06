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
          paddingBottom: insets.bottom + 56 + 20, // navbar + bottom
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
