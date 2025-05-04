import { useGroupedRunData } from "@/hooks/useHealthData";
import {
  HealthkitWriteAuthorization,
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  useHealthkitAuthorization,
} from "@kingstinct/react-native-healthkit";
import { Link } from "expo-router";
import { ScrollView } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

const saveableWorkoutStuff: readonly HealthkitWriteAuthorization[] = [
  "HKQuantityTypeIdentifierDistanceWalkingRunning",
  "HKQuantityTypeIdentifierActiveEnergyBurned",
  "HKWorkoutTypeIdentifier",
  "HKWorkoutRouteTypeIdentifier",
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.runningSpeed,
];

export default function Index() {
  const [authorizationStatus, requestAuthorization] =
    useHealthkitAuthorization(saveableWorkoutStuff);

  const groupedRuns = useGroupedRunData();
  const theme = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        top: 0,
        bottom: 0,
        flexGrow: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Fastest Times
      </Text>

      <Link href="/settings/modal">Open Settings</Link>

      {groupedRuns &&
        Object.entries(groupedRuns).map(([distance, runs]) => (
          <Card key={distance} style={{ marginBottom: 16 }}>
            <Card.Title
              title={`${distance} mi`}
              titleVariant="headlineMedium"
              titleStyle={{ fontWeight: "bold" }}
              rightStyle={{ marginRight: 16 }}
              right={({ size }) => (
                <Text
                  style={{
                    fontSize: size * 0.8,
                  }}
                >
                  {runs.fastestRun?.totalDistance?.quantity.toFixed(2)} mi in{" "}
                  {Math.round(runs.fastestRun?.duration || 0) / 60} mins
                </Text>
              )}
            />
            <Card.Content>
              <Text variant="bodyMedium">
                {runs.fastestRun?.startDate.toLocaleDateString()}{" "}
                {runs.fastestRun?.startDate.toLocaleTimeString()}
              </Text>
              <Text variant="bodyMedium" style={{ marginTop: 8 }}>
                {runs.fastestRun?.totalEnergyBurned?.quantity} kcal
              </Text>
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
  );
}
