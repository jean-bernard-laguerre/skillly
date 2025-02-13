import { Tabs } from "expo-router";

export default function RecruiterLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="jobs" />
    </Tabs>
  );
}
