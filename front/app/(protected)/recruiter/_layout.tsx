import { Tabs } from "expo-router";

export default function RecruiterLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jobs" />
    </Tabs>
  );
}
