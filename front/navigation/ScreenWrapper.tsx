import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigationVisibility } from "@/context/NavigationVisibilityContext";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function ScreenWrapper({ children, style }: ScreenWrapperProps) {
  const { isNavigationVisible } = useNavigationVisibility();

  return (
    <SafeAreaView
      style={[
        {flex: 1},
        style,
      ]}
       edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
}
