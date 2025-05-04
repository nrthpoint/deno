import { DistanceUnit } from "@/constants/units";
import { useSettings } from "@/hooks/useSettings";
import { Stack, useRouter } from "expo-router";
import { View } from "react-native";
import { Text, Switch, List, IconButton } from "react-native-paper";

export default function SettingsModal() {
  const router = useRouter();
  const { unit, toggleUnit } = useSettings();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Stack.Screen options={{ title: "Settings", presentation: "modal" }} />
      <IconButton icon="close" onPress={() => router.back()} />

      <Text variant="titleLarge" style={{ marginBottom: 24 }}>
        Settings
      </Text>

      <List.Item
        title="Use Kilometers"
        description="Toggle between kilometers and miles"
        right={() => (
          <Switch
            value={unit === DistanceUnit.Kilometers}
            onValueChange={toggleUnit}
          />
        )}
      />
    </View>
  );
}
