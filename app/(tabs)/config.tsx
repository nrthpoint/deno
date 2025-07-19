import { DISTANCE_UNIT_OPTIONS } from "@/config/distanceUnits";
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS } from "@/config/timeRanges";
import { useSettings } from "@/context/SettingsContext";
import { WorkoutActivityType } from "@kingstinct/react-native-healthkit";
import Slider from "@react-native-community/slider";
import React from "react";
import { ScrollView, View } from "react-native";
import { SegmentedButtons, Text, useTheme } from "react-native-paper";

export default function ConfigurationScreen() {
  const theme = useTheme();

  const {
    distanceUnit,
    activityType,
    timeRangeInDays: timeRange,
    setDistanceUnit,
    setActivityType,
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
      <Text variant="titleLarge">Distance Unit</Text>
      <SegmentedButtons
        value={distanceUnit}
        onValueChange={setDistanceUnit}
        buttons={DISTANCE_UNIT_OPTIONS.map(option => ({
          label: option.label,
          value: option.value,
        }))}
      />

      <Text variant="titleLarge">Activity</Text>
      <SegmentedButtons
        value={String(activityType)}
        onValueChange={(value) => setActivityType(value as unknown as WorkoutActivityType)}
        buttons={[
          { label: "Running", value: String(WorkoutActivityType.running) },
          { label: "Walking", value: String(WorkoutActivityType.walking) },
          { label: "Cycling", value: String(WorkoutActivityType.cycling) },
        ]}
      />

      <Text variant="titleLarge">Range</Text>
      <View style={{ paddingHorizontal: 8 }}>
        <Text variant="bodyLarge" style={{ textAlign: 'center', marginBottom: 8 }}>
          {TIME_RANGE_LABELS[timeRange]}
        </Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={0}
          maximumValue={TIME_RANGE_OPTIONS.length - 1}
          value={TIME_RANGE_OPTIONS.findIndex(option => option.value === timeRange)}
          onValueChange={(sliderValue) => {
            const index = Math.round(sliderValue);
            setTimeRange(TIME_RANGE_OPTIONS[index].value);
          }}
          step={1}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.outline}
          thumbTintColor={theme.colors.primary}
        />
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginTop: 8 
        }}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {TIME_RANGE_OPTIONS[0].label}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
