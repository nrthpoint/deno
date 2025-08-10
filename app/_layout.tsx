import { SettingsProvider } from '@/context/SettingsContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    OrelegaOne: require('../assets/fonts/OrelegaOne-Regular.ttf'),
    'Lato-Regular': require('../assets/fonts/Lato/Lato-Regular.ttf'),
    'Lato-Bold': require('../assets/fonts/Lato/Lato-Bold.ttf'),
    'Lato-Italic': require('../assets/fonts/Lato/Lato-Italic.ttf'),
    'Lato-BoldItalic': require('../assets/fonts/Lato/Lato-BoldItalic.ttf'),
    'Lato-Light': require('../assets/fonts/Lato/Lato-Light.ttf'),
    'Lato-LightItalic': require('../assets/fonts/Lato/Lato-LightItalic.ttf'),
    'Lato-Black': require('../assets/fonts/Lato/Lato-Black.ttf'),
    'Lato-BlackItalic': require('../assets/fonts/Lato/Lato-BlackItalic.ttf'),
    'Lato-Thin': require('../assets/fonts/Lato/Lato-Thin.ttf'),
    'Lato-ThinItalic': require('../assets/fonts/Lato/Lato-ThinItalic.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SettingsProvider>
          <WorkoutProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  flexGrow: 1,
                  backgroundColor: '#121212',
                },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="workout-detail"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                }}
              />
            </Stack>
          </WorkoutProvider>
        </SettingsProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
