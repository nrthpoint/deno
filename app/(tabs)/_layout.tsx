import { router, Tabs } from "expo-router";
import { IconButton, MD3DarkTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: MD3DarkTheme.colors.elevation.level2,
        },
        headerTintColor: MD3DarkTheme.colors.secondary,
        headerTitleStyle: {
          color: MD3DarkTheme.colors.onSurface,
        },
        tabBarStyle: { backgroundColor: MD3DarkTheme.colors.elevation.level2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Times",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
          headerRight: () => (
            <IconButton
              icon="cog"
              onPress={() => router.push("/settings/modal")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Configure",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
