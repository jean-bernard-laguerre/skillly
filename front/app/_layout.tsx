import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import TabNavigator from "@/navigation/TabNavigator";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "../global.css";

function RootLayoutNav() {
  const { role, loading } = useAuth();

  if (loading) {
    return null; // Ou un composant de chargement
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {role === null ? (
        <TabNavigator role={null} />
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
