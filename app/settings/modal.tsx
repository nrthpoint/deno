import { useSettings } from "@/context/SettingsContext";
import { Stack } from "expo-router";
import { View } from "react-native";
import { List, Switch } from "react-native-paper";

export default function SettingsModal() {
  const { unit, toggleUnit } = useSettings();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
        }}
      />
      <View style={{ flex: 1, padding: 24 }}>
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
