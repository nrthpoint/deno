import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ComparisonCard } from '@/components/ComparisonCard/ComparisonCard';
import { SampleOption, SampleType } from '@/components/ComparisonCard/ComparisonCard.types';
import { SampleDropdown } from '@/components/ComparisonCard/SampleDropdown';
import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { TabHeader } from '@/components/GroupStats/tabs/components/TabHeader';
import { SplitComparison } from '@/components/SplitComparison/SplitComparison';
import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { WeatherComparison } from '@/components/WeatherComparison/WeatherComparison';
import { colors } from '@/config/colors';
import { useSettings } from '@/context/SettingsContext';

export interface ComparisonTabProps extends TabContentProps {
  selectedSample1Type: SampleType;
  selectedSample2Type: SampleType;
  onSample1Change: (type: SampleType) => void;
  onSample2Change: (type: SampleType) => void;
}

type ComparisonMode = 'general' | 'splits' | 'weather';

// Tab options for the custom TabBar
const comparisonTabs: TabOption[] = [
  { id: 'general', label: 'Overall' },
  { id: 'splits', label: 'Splits' },
  { id: 'weather', label: 'Weather' },
];

export const ComparisonTab = ({
  group,
  meta: _meta,
  allWorkouts,
  groupType: _groupType,
  timeRangeInDays: _timeRangeInDays,
  selectedSample1Type,
  selectedSample2Type,
  onSample1Change,
  onSample2Change,
}: ComparisonTabProps) => {
  const { distanceUnit } = useSettings();
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('general');

  // Find workouts with personal best achievements for previous comparison
  const personalBestWorkouts = allWorkouts.filter(
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

  // Create sample options from the group data
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

        if (diffTime === 0) return 'Today';
        if (diffTime === 1) return 'Yesterday';

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
  const selectedSample1Label =
    sampleOptions.find((opt) => opt.type === selectedSample1Type)?.label || 'Sample 1';
  const selectedSample2Label =
    sampleOptions.find((opt) => opt.type === selectedSample2Type)?.label || 'Sample 2';

  const renderWorkoutSelectors = () => (
    <View style={styles.workoutSelectors}>
      <View style={styles.dropdownContainer}>
        <SampleDropdown
          options={sampleOptions}
          selectedType={selectedSample1Type}
          onSelect={onSample1Change}
          placeholder="Select Sample 1"
        />
      </View>
      <View style={styles.dropdownContainer}>
        <SampleDropdown
          options={sampleOptions}
          selectedType={selectedSample2Type}
          onSelect={onSample2Change}
          placeholder="Select Sample 2"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionHeader}>Workout Comparison</Text>
      <Text style={styles.sectionDescription}>
        Compare your workouts side by side to see how they stack up against each other.
      </Text> */}
      <TabHeader
        title="Workout Comparison"
        description="Compare your workouts side by side to see how they stack up against each other."
      />

      {renderWorkoutSelectors()}

      <TabBar
        tabs={comparisonTabs}
        activeTabId={comparisonMode}
        onTabPress={(tabId) => setComparisonMode(tabId as ComparisonMode)}
        style={styles.tabBar}
        activeTabColor={colors.primary}
        activeTextColor={colors.neutral}
        inactiveTextColor={colors.lightGray}
      />

      {comparisonMode === 'general' ? (
        <ComparisonCard
          sample1={selectedSample1}
          sample2={selectedSample2}
          sample1Label={selectedSample1Label}
          sample2Label={selectedSample2Label}
          propertiesToCompare={['duration', 'averagePace', 'distance', 'elevation', 'humidity']}
        />
      ) : comparisonMode === 'splits' ? (
        <View style={styles.splitContainer}>
          <SplitComparison
            sample1={selectedSample1}
            sample2={selectedSample2}
            sample1Label={selectedSample1Label}
            sample2Label={selectedSample2Label}
            distanceUnit={distanceUnit}
          />
        </View>
      ) : (
        <View style={styles.splitContainer}>
          <WeatherComparison
            workout1={selectedSample1}
            workout2={selectedSample2}
            workout1Label={selectedSample1Label}
            workout2Label={selectedSample2Label}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 0,
  },

  workoutSelectors: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  dropdownContainer: {
    flex: 1,
  },
  tabBar: {
    marginHorizontal: 5,
    marginBottom: 20,
  },
  splitContainer: {
    flex: 1,
    marginHorizontal: -10,
  },
});
