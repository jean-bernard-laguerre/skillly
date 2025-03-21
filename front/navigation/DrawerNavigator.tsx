import React, { ReactNode } from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Button } from "react-native";

import { useAuth } from "@/context/AuthContext";
import ProfileScreen from "@/app/(protected)/ProfileScreen";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { handleLogOut } = useAuth();

  return (
    <DrawerContentScrollView
      {...props}
      className="flex flex-col justify-between h-full"
    >
      <DrawerItemList {...props} />
      <View style={{ padding: 20 }}>
        <Button title="Se déconnecter" onPress={handleLogOut} />
      </View>
    </DrawerContentScrollView>
  );
};

interface DrawerNavigatorProps {
  children: ReactNode;
}

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ children }: DrawerNavigatorProps) => {
  const { role } = useAuth();
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home">{() => children}</Drawer.Screen>
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Mon Profil" }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
