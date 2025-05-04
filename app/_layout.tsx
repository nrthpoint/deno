import { Stack } from "expo-router";
import { MD3DarkTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            flexGrow: 1,
            backgroundColor: MD3DarkTheme.colors.background,
            paddingTop: 60,
          },
        }}
      />
    </PaperProvider>
  );
}
