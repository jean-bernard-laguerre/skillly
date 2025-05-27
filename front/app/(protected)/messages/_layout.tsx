import { Stack } from "expo-router";

export default function Messages() {
  return (
    <Stack
      initialRouteName="index"
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chatroom"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
