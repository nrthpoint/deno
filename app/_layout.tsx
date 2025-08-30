import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import { colors } from '@/config/colors';
import { SettingsProvider } from '@/context/SettingsContext';
import { WorkoutProvider } from '@/context/WorkoutContext';
import {
  handleNotificationReceived,
  handleNotificationResponse,
  initializeNotifications,
  registerBackgroundTask,
  setAppActive,
} from '@/utils/notificationService';

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

  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Initialize notifications and set up listeners
  useEffect(() => {
    let appStateSubscription: any;

    const setupNotifications = async () => {
      // Initialize notification service
      await initializeNotifications();
      await registerBackgroundTask();

      // Set up notification listeners
      notificationListener.current = Notifications.addNotificationReceivedListener(
        handleNotificationReceived,
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse,
      );

      // Track app state changes
      const handleAppStateChange = (nextAppState: string) => {
        if (nextAppState === 'active') {
          setAppActive();
        }
      };

      appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

      // Set initial active state
      await setAppActive();
    };

    setupNotifications();

    return () => {
      // Clean up listeners
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <PaperProvider>
        <SettingsProvider>
          <WorkoutProvider>
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
            <Toast />
          </WorkoutProvider>
        </SettingsProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
