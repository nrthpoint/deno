import { useGroupedRunData } from "@/hooks/useHealthData";
import { useSettings } from "@/context/SettingsContext";
import {
  HealthkitWriteAuthorization,
  HKAuthorizationRequestStatus,
  HKQuantityTypeIdentifier,
  useHealthkitAuthorization,
} from "@kingstinct/react-native-healthkit";
import { Stack, router } from "expo-router";
import { ScrollView } from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";

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

  const { unit } = useSettings();
  const groupedRuns = useGroupedRunData(unit);
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Fastest Times",
          headerRight: () => (
            <IconButton
              icon="cog"
              onPress={() => router.push("/settings/modal")}
            />
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          top: 0,
          bottom: 0,
          flexGrow: 1,
          backgroundColor: theme.colors.background,
        }}
      >
        {groupedRuns &&
          Object.entries(groupedRuns).map(([distance, runs]) => (
            <Card key={distance} style={{ marginBottom: 16 }}>
              <Card.Title
                title={`${distance}${unit}`}
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
                    {unit} in {Math.round(runs.fastestRun?.duration || 0) / 60}{" "}
                    mins
                  </Text>
                )}
              />
              {/* <Card.Content>
                <Text variant="bodyMedium">
                  {runs.fastestRun?.startDate.toLocaleDateString()}{" "}
                  {runs.fastestRun?.startDate.toLocaleTimeString()}
                </Text>
              </Card.Content> */}
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
