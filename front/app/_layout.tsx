import { AuthProvider } from "@/context/AuthContext";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import { queryClient } from "@/lib/queryClient";
import TabNavigator from "@/navigation/TabNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "@/components/SplashScreen";
import GlobalNotifications from "@/components/GlobalNotifications";
import { useState } from "react";
import "../global.css";
import { Host } from "react-native-portalize";

// Configuration Reanimated pour désactiver tous les warnings
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "[Reanimated] Reading from `value` during component render",
  "[Reanimated]",
  "Reanimated",
  // Ignorer les erreurs Axios pour éviter l'affichage dans l'UI
  "Error fetching current user:",
  "AxiosError:",
  "Request failed with status code 401",
]);

// Désactiver complètement les warnings Reanimated
if (__DEV__) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (
      args[0] &&
      typeof args[0] === "string" &&
      (args[0].includes("[Reanimated]") ||
        args[0].includes("AxiosError") ||
        args[0].includes("Request failed with status code 401"))
    ) {
      return;
    }
    originalWarn(...args);
  };
}

export default function RootLayout() {
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  const handleSplashFinish = () => {
    setShowSplashScreen(false);
  };

  return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UnreadMessagesProvider>
            {/* Composant invisible pour gérer les notifications globales */}
            <GlobalNotifications />
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Host>
                <TabNavigator />
                {showSplashScreen && (
                  <SplashScreen onFinish={handleSplashFinish} />
                )}
              </Host>
            </GestureHandlerRootView>
          </UnreadMessagesProvider>
        </AuthProvider>
      </QueryClientProvider>
  );
}
