import { AuthorizationRequestStatus } from '@kingstinct/react-native-healthkit';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { AuthorizationOverlay } from '@/components/AuthorizationOverlay';
import { LoadingScreen } from '@/components/LoadingScreen';
import { colors } from '@/config/colors';
import { toastConfig } from '@/config/toast';
import { SettingsProvider } from '@/context/SettingsContext';
import { TutorialProvider } from '@/context/TutorialContext';
import { WorkoutProvider } from '@/context/Workout';
import { WorkoutAnalyticsProvider } from '@/context/WorkoutAnalytics';
import { useWorkoutAuthorization } from '@/hooks/useWorkoutAuthorization';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { authorizationStatus, requestAuthorization } = useWorkoutAuthorization();

  // Show loading screen while authorization status is being determined
  if (authorizationStatus === null) {
    return <LoadingScreen message="Initializing..." />;
  }

  // Show authorization overlay if permission is needed
  if (authorizationStatus !== AuthorizationRequestStatus.unnecessary) {
    return (
      <AuthorizationOverlay
        authorizationStatus={authorizationStatus}
        requestAuthorization={requestAuthorization}
      />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="add-workout"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="view-workout"
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <PaperProvider>
        <SettingsProvider>
          <TutorialProvider>
            <WorkoutProvider>
              <WorkoutAnalyticsProvider>
                <AppContent />
              </WorkoutAnalyticsProvider>
            </WorkoutProvider>
          </TutorialProvider>
        </SettingsProvider>
        <Toast config={toastConfig} />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
