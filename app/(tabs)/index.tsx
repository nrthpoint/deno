import { useSettings } from "@/context/SettingsContext";
import {
  GroupType,
  useGroupedActivityData,
} from "@/hooks/useGroupedActivityData";
import {
  AuthorizationRequestStatus,
  ObjectTypeIdentifier,
  useHealthkitAuthorization,
} from "@kingstinct/react-native-healthkit";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Icon,
  SegmentedButtons,
  Text,
  useTheme,
} from "react-native-paper";

const saveableWorkoutStuff: readonly ObjectTypeIdentifier[] = [
  "HKWorkoutTypeIdentifier",
  "HKWorkoutRouteTypeIdentifier",
];

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(saveableWorkoutStuff);

  const { distanceUnit, timeRangeInDays, activityType } = useSettings();
  const [groupType, setGroupingType] = useState<GroupType>("distance");
  const { groups, loading } = useGroupedActivityData({
    activityType,
    distanceUnit,
    timeRangeInDays,
    groupType,
  });
  const theme = useTheme();

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          top: 0,
          bottom: 0,
          flexGrow: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        <Text variant="titleLarge">Group By</Text>
        <SegmentedButtons
          value={groupType}
          onValueChange={setGroupingType}
          buttons={[
            { label: "Distance", value: "distance" },
            { label: "Pace", value: "pace" },
            { label: "Weather", value: "weather" },
          ]}
        />

        {loading && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 16 }}>Loading your runs...</Text>
          </View>
        )}

        {!loading &&
          groups &&
          Object.entries(groups).map(([key, obj]) => (
            <Card key={key} style={{ marginBottom: 16 }}>
              <Card.Title
                title={`${obj.title}`}
                titleVariant="headlineMedium"
                titleStyle={{ fontWeight: "bold" }}
                rightStyle={{ marginRight: 16 }}
                right={({ size }) => (
                  <Text
                    style={{
                      fontSize: size * 0.8,
                    }}
                  >
                    {obj.title}
                  </Text>
                )}
              />
              <Card.Content>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon source="clock" size={24} color="#fff" />
                  <Text style={{ marginLeft: 8, marginRight: 16 }}>
                    {obj.highlight.daysAgo}
                  </Text>
                  <Icon source="run-fast" size={24} color="#fff" />
                  <Text style={{ marginLeft: 8 }}>
                    {obj.highlight.prettyPace}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}

        {!loading && !groups && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 40,
            }}
          >
            <Text>No running data found</Text>
          </View>
        )}

        {authorizationStatus !== AuthorizationRequestStatus.unnecessary && (
          <Button
            mode="contained"
            onPress={async () => {
              const status = await requestAuthorization();
              console.log("Authorization Status:", status);
            }}
          >
            Request Authorization
          </Button>
        )}
      </ScrollView>
    </>
  );
}
