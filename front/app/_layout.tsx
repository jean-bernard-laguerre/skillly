import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabNavigator from "@/navigation/TabNavigator";
import { useAuth } from "@/lib/hooks/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "../global.css";
import { AuthProvider } from "@/context/AuthContext";

function RootLayoutNav() {
  const { role } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TabNavigator role={role ?? null} />
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
