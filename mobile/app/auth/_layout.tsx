import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: "#6366f1",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerTitle: "Welcome",
      }}
    >
      <Stack.Screen name="StartupScreen" options={{ headerShown: true }} />
      <Stack.Screen name="HomeScreen" options={{ headerShown: true }} />
      <Stack.Screen name="LoginScreen" options={{ headerShown: true }} />
      <Stack.Screen name="SignupScreen" options={{ headerShown: true }} />
    </Stack>
  );
}
