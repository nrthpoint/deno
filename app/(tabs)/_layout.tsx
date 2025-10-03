import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { colors } from '@/config/colors';
import { useWorkout } from '@/context/Workout';

export default function TabLayout() {
  const { workouts } = useWorkout();

  if (workouts.samples.length === 0) {
    return <Redirect href="/no-workouts" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: '#1C1C1C' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Metrics',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="stats-chart"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trends"
        options={{
          title: 'Trends',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="trending-up"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
