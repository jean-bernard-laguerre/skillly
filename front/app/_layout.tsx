import "react-native-reanimated";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabNavigator from "@/navigation/TabNavigator";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <TabNavigator />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
