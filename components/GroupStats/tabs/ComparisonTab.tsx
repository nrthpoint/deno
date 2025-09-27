import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { ComparisonCard } from '@/components/ComparisonCard/ComparisonCard';
import { SampleOption, SampleType } from '@/components/ComparisonCard/ComparisonCard.types';
import { SampleDropdown } from '@/components/ComparisonCard/SampleDropdown';
import { TabHeader } from '@/components/GroupStats/tabs/components/TabHeader';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { SplitComparison } from '@/components/SplitComparison/SplitComparison';
import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { Warning } from '@/components/Warning';
import { WeatherComparison } from '@/components/WeatherComparison/WeatherComparison';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';
import { useSettings } from '@/context/SettingsContext';
import { useWorkout } from '@/context/WorkoutContext';

type ComparisonMode = 'general' | 'splits' | 'weather';

// Tab options for the custom TabBar
const comparisonTabs: TabOption[] = [
  { id: 'general', label: 'Overall' },
  { id: 'splits', label: 'Splits' },
  { id: 'weather', label: 'Weather' },
];

export const ComparisonTab = () => {
  const { group } = useGroupStats();
  const { distanceUnit } = useSettings();
  const { setSelectedWorkouts } = useWorkout();
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('general');
  const [selectedSample1Type, setSelectedSample1Type] = useState<SampleType>('highlight');
  const [selectedSample2Type, setSelectedSample2Type] = useState<SampleType>('mostRecent');

  const personalBestWorkouts = group.runs.filter(
    (w) =>
      w.achievements.isAllTimeFastest ||
      w.achievements.isAllTimeLongest ||
      w.achievements.isAllTimeFurthest ||
      w.achievements.isAllTimeHighestElevation,
  );

  // Get the most recent personal best workout for previous comparison
  const mostRecentPersonalBest =
    personalBestWorkouts.length > 0
      ? personalBestWorkouts.sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        )[0]
      : group.highlight; // Fallback to highlight if no personal bests found

  const sampleOptions: SampleOption[] = [
    {
      type: 'highlight',
      label: 'Best Performance',
      workout: group.highlight,
    },
    {
      type: 'worst',
      label: 'Worst Performance',
      workout: group.worst,
    },
    {
      type: 'mostRecent',
      label: (() => {
        const today = new Date();
        const mostRecent = group.mostRecent.endDate;

        const diffTime = Math.floor(
          (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffTime === 0) return 'Most Recent (Today)';
        if (diffTime === 1) return 'Most Recent (Yesterday)';

        return `Most Recent (${diffTime}d)`;
      })(),
      workout: group.mostRecent,
    },
    {
      type: 'previousPersonalBest',
      label: (() => {
        const workout = mostRecentPersonalBest;
        if (!workout || !workout.achievements) return 'Previous Personal Best';

        if (workout.achievements.isAllTimeFastest) return 'Previous Fastest';
        if (workout.achievements.isAllTimeLongest) return 'Previous Longest';
        if (workout.achievements.isAllTimeFurthest) return 'Previous Furthest';
        if (workout.achievements.isAllTimeHighestElevation) return 'Previous Highest';

        return 'Previous Personal Best';
      })(),
      workout: mostRecentPersonalBest,
    },
  ];

  // Get the selected samples based on the current selection
  const getSelectedSample = (type: SampleType) => {
    switch (type) {
      case 'highlight':
        return group.highlight;
      case 'worst':
        return group.worst;
      case 'mostRecent':
        return group.mostRecent;
      case 'previousPersonalBest':
        return mostRecentPersonalBest;
      default:
        return group.highlight;
    }
  };

  const selectedSample1 = getSelectedSample(selectedSample1Type);
  const selectedSample2 = getSelectedSample(selectedSample2Type);

  const handleMapPress = () => {
    setSelectedWorkouts([selectedSample1, selectedSample2]);
    router.push('/map-detail?mode=comparison');
  };

  // Check if both samples are the same workout
  const isSameWorkout =
    selectedSample1?.uuid && selectedSample2?.uuid && selectedSample1.uuid === selectedSample2.uuid;

  const renderWorkoutSelectors = () => (
    <View style={styles.workoutSelectors}>
      <View style={styles.dropdownWithLabel}>
        <View style={styles.dropdownLabelContainer}>
          <Text style={styles.dropdownLabel}>1</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <SampleDropdown
            options={sampleOptions}
            selectedType={selectedSample1Type}
            onSelect={setSelectedSample1Type}
            placeholder="Select Sample 1"
            showShortLabel={true}
            shortLabel="1"
          />
        </View>
      </View>
      <View style={styles.vsContainer}>
        <Text style={styles.vsText}>vs.</Text>
      </View>
      <View style={styles.dropdownWithLabel}>
        <View style={styles.dropdownLabelContainer}>
          <Text style={styles.dropdownLabel}>2</Text>
        </View>
        <View style={styles.dropdownContainer}>
          <SampleDropdown
            options={sampleOptions}
            selectedType={selectedSample2Type}
            onSelect={setSelectedSample2Type}
            placeholder="Select Sample 2"
            showShortLabel={true}
            shortLabel="2"
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TabHeader
          title="Compare"
          description="Compare your workouts side by side to see how they stack up against each other."
        />

        {renderWorkoutSelectors()}

        {isSameWorkout && (
          <Warning
            title="Same Workout Selected"
            style={{ marginTop: 10 }}
            message="You're comparing the same workout to itself. Select different workouts to see meaningful comparisons."
          />
        )}

        {!isSameWorkout && (
          <RouteMap
            samples={[selectedSample1, selectedSample2]}
            previewMode={true}
            onPress={handleMapPress}
            maxPoints={30}
            style={{ borderRadius: 8 }}
            sampleLabels={['Run 1', 'Run 2']}
          />
        )}

        <TabBar
          tabs={comparisonTabs}
          activeTabId={comparisonMode}
          onTabPress={(tabId) => setComparisonMode(tabId as ComparisonMode)}
          style={styles.tabBar}
          activeTabColor={colors.primary}
        />
      </View>

      {comparisonMode === 'general' ? (
        <ComparisonCard
          sample1={selectedSample1}
          sample2={selectedSample2}
          sample1Label="1"
          sample2Label="2"
          propertiesToCompare={['duration', 'averagePace', 'distance', 'elevation', 'humidity']}
        />
      ) : comparisonMode === 'splits' ? (
        <View style={styles.splitContainer}>
          <SplitComparison
            sample1={selectedSample1}
            sample2={selectedSample2}
            sample1Label="1"
            sample2Label="2"
            distanceUnit={distanceUnit}
          />
        </View>
      ) : (
        <View style={styles.splitContainer}>
          <WeatherComparison
            workout1={selectedSample1}
            workout2={selectedSample2}
            workout1Label="1"
            workout2Label="2"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  workoutSelectors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownWithLabel: {
    flex: 1,
    alignItems: 'center',
  },
  dropdownLabelContainer: {
    borderRadius: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    alignContent: 'center',
    alignSelf: 'center',
    marginBottom: 8,
    width: 32,
    height: 32,
    paddingTop: 6,
  },
  dropdownLabel: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 10,
  },
  dropdownContainer: {
    width: '100%',
  },
  vsContainer: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
  },
  vsText: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  tabBar: {
    marginVertical: 10,
  },
  splitContainer: {
    flex: 1,
    marginHorizontal: -10,
  },
});
