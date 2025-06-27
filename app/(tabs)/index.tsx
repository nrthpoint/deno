import { useSettings } from "@/context/SettingsContext";
import { getPace, useGroupedRunData } from "@/hooks/useHealthData";
import {
  HealthkitWriteAuthorization,
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  UnitOfLength,
  useHealthkitAuthorization,
} from "@kingstinct/react-native-healthkit";
import { ScrollView, View } from "react-native";
import { Button, Card, Icon, Text, useTheme } from "react-native-paper";

const saveableWorkoutStuff: readonly HealthkitWriteAuthorization[] = [
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKWorkoutTypeIdentifier",
  "HKWorkoutRouteTypeIdentifier",
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.runningSpeed,
];

const formatDuration = (duration: number) => {
  const totalSeconds = Math.round(duration);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours > 0 ? `${hours}hr` : null,
    minutes > 0 ? `${minutes}min` : null,
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(saveableWorkoutStuff);

  const { unit, speedType } = useSettings();
  const groupedRuns = useGroupedRunData(unit, speedType);
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
        <Text variant="headlineLarge" style={{ marginBottom: 16 }}>
          Fastest runs by distance
        </Text>
        {groupedRuns &&
          Object.entries(groupedRuns).map(([distance, runs]) => (
            <Card key={distance} style={{ marginBottom: 16 }}>
              <Card.Title
                title={`${distance} ${unit}`}
                titleVariant="headlineMedium"
                titleStyle={{ fontWeight: "bold" }}
                rightStyle={{ marginRight: 16 }}
                right={({ size }) => (
                  <Text
                    style={{
                      fontSize: size * 0.8,
                    }}
                  >
                    {runs.fastestRun?.totalDistance?.quantity.toFixed(2)}
                    {unit} in {formatDuration(runs.fastestRun?.duration || 0)}
                  </Text>
                )}
              />
              <Card.Content>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon source="clock" size={24} color="#fff" />
                  <Text style={{ marginLeft: 8, marginRight: 16 }}>
                    {Math.round(
                      (new Date().getTime() -
                        runs.fastestRun?.startDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days ago
                  </Text>
                  <Icon source="run-fast" size={24} color="#fff" />
                  <Text style={{ marginLeft: 8 }}>
                    {getPace(runs.fastestRun || {}).toFixed(2)} min/
                    {runs.fastestRun.totalDistance?.unit}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}

        {authorizationStatus !== HKAuthorizationRequestStatus.unnecessary && (
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
