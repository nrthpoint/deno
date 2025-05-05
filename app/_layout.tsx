import { SettingsProvider } from "@/context/SettingsContext";
import { Stack } from "expo-router";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <SettingsProvider>
        <Stack
          screenOptions={{
            contentStyle: {
              flexGrow: 1,
              backgroundColor: MD3DarkTheme.colors.background,
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SettingsProvider>
    </PaperProvider>
  );
}
