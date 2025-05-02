import { useGroupedRunData } from "@/hooks/useHealthData";
import {
  HealthkitWriteAuthorization,
  HKQuantityTypeIdentifier,
  useHealthkitAuthorization,
} from "@kingstinct/react-native-healthkit";
import { Text, Button, Card, ProgressBar, useTheme } from "react-native-paper";
import { ScrollView, View } from "react-native";

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
        Runs
      </Text>

      {groupedRuns &&
        Object.entries(groupedRuns).map(([distance, runs]) => (
          <Card key={distance} style={{ marginBottom: 16 }}>
            <Card.Title
              title={`${distance} Miles`}
              subtitleVariant="headlineSmall"
            />
            <Card.Content>
              <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                Fastest Run is{" "}
                {runs.fastestRun?.totalDistance?.quantity.toFixed(2)} mi in{" "}
                {runs.fastestRun?.duration}s,{" "}
              </Text>

              {runs.runs.map((run, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <ProgressBar
                    progress={
                      run.duration / (runs.fastestRun?.duration || run.duration)
                    }
                    color={theme.colors.primary}
                  />
                  <Text variant="labelSmall">
                    {Math.round(run.duration)}s –{" "}
                    {run.totalDistance?.quantity.toFixed(2)} mi
                  </Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}

      <Button
        mode="contained"
        onPress={async () => {
          const status = await requestAuthorization();
          console.log("Authorization Status:", status);
        }}
      >
        Request Authorization
      </Button>
    </ScrollView>
  );
}
