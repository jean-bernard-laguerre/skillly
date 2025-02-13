import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

import { AuthProvider, useAuth } from "../context/AuthContext";
import "../global.css";

export default function RootLayout() {
  const { role } = useAuth();

  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer>
          <Drawer.Screen
            name="drawer/ProfileScreen" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: "Profile",
              title: "overview",
            }}
            redirect={role === null}
          />
          {/* faire un bouton pour se déconnecter */}
        </Drawer>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
