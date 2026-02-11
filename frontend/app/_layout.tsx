import { Stack } from "expo-router";
import { SepetProvider } from "../context/SepetContext"; // Context'i içe aktar

export default function RootLayout() {
  return (
    // TÜM UYGULAMAYI BU ŞEKİLDE SARMALIYORUZ
    <SepetProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SepetProvider>
  );
}