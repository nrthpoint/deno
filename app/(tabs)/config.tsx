import { useSettings } from "@/context/SettingsContext";
import React from "react";
import { ScrollView } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";

export default function ConfigurationScreen() {
  const theme = useTheme();

  const {
    activityType,
    speedType,
    timeRange,
    setActivityType,
    setSpeedType,
    setTimeRange,
  } = useSettings();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 24,
        flexGrow: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text variant="titleLarge">Activity Type</Text>
      <SegmentedButtons
        value={activityType}
        onValueChange={setActivityType}
        buttons={[
          { label: "Runs", value: "runs" },
          { label: "Walks", value: "walks", disabled: true },
          { label: "Cycles", value: "cycles", disabled: true },
          { label: "Sprints", value: "sprints", disabled: true },
        ]}
      />

      <Text variant="titleLarge">Sort By</Text>
      <SegmentedButtons
        value={speedType}
        onValueChange={setSpeedType}
        buttons={[
          { label: "Time", value: "time" },
          { label: "Pace", value: "pace" },
        ]}
      />

      <Text variant="titleLarge">Time Range</Text>
      <SegmentedButtons
        value={timeRange}
        onValueChange={setTimeRange}
        buttons={[
          { label: "Month", value: "month" },
          { label: "Quarter", value: "quarter" },
          { label: "3 Months", value: "3_months" },
          { label: "All Time", value: "all_time" },
        ]}
      />
    </ScrollView>
  );
}
