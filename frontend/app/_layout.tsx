import { Stack } from "expo-router";
import { SepetProvider } from "../context/SepetContext";

export default function RootLayout() {
  return (
    <SepetProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SepetProvider>
  );
}