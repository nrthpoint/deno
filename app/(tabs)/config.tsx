import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import Slider from '@react-native-community/slider';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';

import AppInfo from '@/components/AppInfo';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { LatoFonts } from '@/config/fonts';
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS } from '@/config/timeRanges';
import { useSettings } from '@/context/SettingsContext';
import { subheading } from '@/utils/text';

const SegmentedButtonsTheme = {
  // https://callstack.github.io/react-native-paper/docs/components/SegmentedButtons/#theme-colors
  colors: {
    primary: colors.surfaceHighlight, // Primary color for active buttons
    onSecondaryContainer: colors.neutral, // Text color for active buttons
    secondaryContainer: colors.surface, // Active button color
    outline: colors.neutral, // Border color for inactive buttons
    onSurface: colors.neutral, // Text color for inactive buttons
    onSurfaceDisabled: '#7e7e7eff', // Text color for disabled buttons
    surfaceDisabled: '#3d3d3dff', // Border for inactive buttons
  },
};

export default function ConfigurationScreen() {
  const {
    distanceUnit,
    activityType,
    timeRangeInDays: timeRange,
    setDistanceUnit,
    setActivityType,
    setTimeRange,
  } = useSettings();

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={[styles.container]}>
        <Text variant="titleLarge" style={styles.heading}>
          Distance Unit
        </Text>
        <SegmentedButtons
          value={distanceUnit}
          onValueChange={setDistanceUnit}
          style={styles.segmentedButtons}
          theme={SegmentedButtonsTheme}
          buttons={DISTANCE_UNIT_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
            disabled: !option.enabled,
          }))}
        />

        <Text variant="titleLarge" style={styles.heading}>
          Activity
        </Text>
        <SegmentedButtons
          value={String(activityType)}
          onValueChange={(value) => setActivityType(value as unknown as WorkoutActivityType)}
          style={styles.segmentedButtons}
          theme={SegmentedButtonsTheme}
          buttons={[
            { label: 'Running', value: String(WorkoutActivityType.running) },
            { label: 'Walking', value: String(WorkoutActivityType.walking), disabled: true },
            { label: 'Cycling', value: String(WorkoutActivityType.cycling), disabled: true },
          ]}
        />

        <Text variant="titleLarge" style={styles.heading}>
          Time Range
        </Text>

        <View style={styles.rangeContainer}>
          <Text variant="bodyLarge" style={styles.rangeTitle}>
            {TIME_RANGE_LABELS[timeRange]}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={TIME_RANGE_OPTIONS.length - 1}
            value={TIME_RANGE_OPTIONS.findIndex((option) => option.value === timeRange)}
            onValueChange={(sliderValue) => {
              const index = Math.round(sliderValue);
              setTimeRange(TIME_RANGE_OPTIONS[index].value);
            }}
            step={1}
            minimumTrackTintColor={colors.neutral}
            maximumTrackTintColor={'#121212'}
            thumbTintColor={colors.neutral}
          />
          <View style={styles.rangeLabelsContainer}>
            <Text variant="bodySmall" style={[styles.rangeLabel]}>
              {TIME_RANGE_OPTIONS[0].label}
            </Text>
            <Text variant="bodySmall" style={[styles.rangeLabel]}>
              {TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
            </Text>
          </View>
        </View>

        <AppInfo />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'OrelegaOne',
    textAlign: 'left',
  },
  container: {
    padding: 16,
    gap: 24,
    flexGrow: 1,
    backgroundColor: colors.background,
    color: '#fff',
  },
  segmentedButtons: {
    marginVertical: 0,
  },
  heading: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    marginBottom: 0,
    marginTop: 16,
    color: colors.neutral,
  },
  rangeContainer: {
    paddingHorizontal: 8,
  },
  rangeTitle: {
    ...subheading,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 18,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeLabel: {
    ...subheading,
  },
});
