import React from "react";
import { ViewStyle } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          backgroundColor: "transparent",
          paddingBottom: 48, // navbar (56) + bottom offset (8)
        },
        style,
      ]}
      edges={[]}
    >
      <BlurView
        intensity={20}
        tint="light"
        style={{
          flex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        {children}
      </BlurView>
    </SafeAreaView>
  );
}
