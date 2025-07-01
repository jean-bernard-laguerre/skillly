import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: "#F7F7F7",
          paddingBottom: 48, // navbar (56) + bottom offset (8)
        },
        style,
      ]}
      edges={[]}
    >
      {children}
    </SafeAreaView>
  );
}
