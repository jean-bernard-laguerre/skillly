import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabNavigator from "@/navigation/TabNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

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
