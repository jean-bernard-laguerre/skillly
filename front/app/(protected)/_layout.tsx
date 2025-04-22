import { Slot } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "../../navigation/DrawerNavigator";
import TabNavigator from "../../navigation/TabNavigator";
import { useAuth } from "@/context/AuthContext";

export default function Layout() {
  const { role } = useAuth();
  return (
    <DrawerNavigator>
      <TabNavigator role={role} />
    </DrawerNavigator>
  );
}
