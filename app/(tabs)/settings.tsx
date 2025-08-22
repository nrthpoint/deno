import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import Slider from '@react-native-community/slider';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import AppInfo from '@/components/AppInfo';
import { Card } from '@/components/Card/Card';
import { TabBar } from '@/components/TabBar';
import { colors } from '@/config/colors';
import { DISTANCE_UNIT_OPTIONS } from '@/config/distanceUnits';
import { LatoFonts } from '@/config/fonts';
import { TIME_RANGE_LABELS, TIME_RANGE_OPTIONS } from '@/config/timeRanges';
import { useSettings } from '@/context/SettingsContext';
import { subheading } from '@/utils/text';

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
        <Text
          variant="titleLarge"
          style={styles.heading}
        >
          Distance Unit
        </Text>

        <TabBar
          tabs={DISTANCE_UNIT_OPTIONS.map((option) => ({
            id: option.value,
            label: option.label,
            disabled: !option.enabled,
          }))}
          activeTabId={distanceUnit}
          onTabPress={(id) => setDistanceUnit(id as unknown as LengthUnit)}
          activeTabColor={colors.primary}
          inactiveTabColor="transparent"
          activeTextColor="#FFFFFF"
          inactiveTextColor="#999999"
        />

        <Text
          variant="titleLarge"
          style={styles.heading}
        >
          Activity
        </Text>

        <TabBar
          tabs={[
            { id: String(WorkoutActivityType.running), label: 'Running' },
            { id: String(WorkoutActivityType.walking), label: 'Walking', disabled: true },
            { id: String(WorkoutActivityType.cycling), label: 'Cycling', disabled: true },
          ]}
          activeTabId={String(activityType)}
          onTabPress={(value) => setActivityType(value as unknown as WorkoutActivityType)}
          activeTabColor={colors.primary}
          inactiveTabColor="transparent"
          activeTextColor="#FFFFFF"
          inactiveTextColor="#999999"
        />

        <Card>
          <View style={styles.cardContent}>
            <Text
              variant="titleLarge"
              style={[styles.heading, { marginTop: 0 }]}
            >
              Time Range
            </Text>
            <Text style={styles.subheading}>
              The amount of time from now, to fetch workout data.
            </Text>

            <View style={styles.rangeContainer}>
              <Text
                variant="bodyLarge"
                style={[styles.rangeTitle]}
              >
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
                thumbTintColor={`#424bff`}
              />
              <View style={styles.rangeLabelsContainer}>
                <Text
                  variant="bodySmall"
                  style={[styles.rangeLabel]}
                >
                  {TIME_RANGE_OPTIONS[0].label}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[styles.rangeLabel]}
                >
                  {TIME_RANGE_OPTIONS[TIME_RANGE_OPTIONS.length - 1].label}
                </Text>
              </View>
            </View>
          </View>
        </Card>

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
  subheading: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    marginTop: 10,
    lineHeight: 22,
  },
  cardContent: {
    padding: 16,
    margin: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceHighlight,
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
  heading: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: LatoFonts.bold,
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
    //marginTop: 8,
  },
  rangeLabel: {
    ...subheading,
  },
});
