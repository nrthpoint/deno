import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { IconButton } from 'react-native-paper';

import { colors } from '@/config/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: '#1C1C1C' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Activity',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" size={size} color={color} />,
          headerRight: () => (
            <IconButton icon="cog" onPress={() => router.push('/settings/modal')} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
