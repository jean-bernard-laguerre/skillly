import "react-native-reanimated";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabNavigator from "@/navigation/TabNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

// Configuration Reanimated pour désactiver tous les warnings
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render",
  "[Reanimated]",
  "Reanimated",
]);

// Désactiver complètement les warnings Reanimated
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      args[0].includes("[Reanimated]")
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <TabNavigator />
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaView>
  );
}
