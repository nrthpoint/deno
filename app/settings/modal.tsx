import { useSettings } from "@/context/SettingsContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import { List, MD3DarkTheme, Switch } from "react-native-paper";

export default function SettingsModal() {
  const { unit, toggleUnit } = useSettings();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Unit Settings",
          headerStyle: {
            backgroundColor: MD3DarkTheme.colors.elevation.level2,
          },
          headerTintColor: MD3DarkTheme.colors.secondary,
          headerBackTitle: "Back",
        }}
      />
      <View>
        <List.Item
          title="Use Kilometers"
          right={() => (
            <Switch value={unit === "km"} onValueChange={toggleUnit} />
          )}
        />
      </View>
    </>
  );
}
