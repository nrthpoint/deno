import { router } from 'expo-router';
import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { CollapsibleStatSection } from '@/components/CollapsibleStatSection/CollapsibleStatSection';
import { VisualCards } from '@/components/GroupStats/GroupHighlights';
import { GroupSummaryStats } from '@/components/GroupSummaryHeader/GroupSummaryStats';
import { RankingCards } from '@/components/RankingCards/RankingCards';
import {
  WorkoutListBottomSheet,
  WorkoutListBottomSheetRef,
} from '@/components/WorkoutListBottomSheet/WorkoutListBottomSheet';
import { colors } from '@/config/colors';
import { useGroupStats } from '@/context/GroupStatsContext';
import { RankingResponse } from '@/services/rankingService';

const getTabColor = (label: string) => {
  switch (label.toLowerCase()) {
    case 'fastest':
    case 'furthest':
      return '#4CAF50';
    case 'slowest':
    case 'shortest':
      return '#f32121';
    case 'most common':
      return '#FF9800';
    case 'highest':
      return '#2196F3';
    case 'lowest':
      return '#9C27B0';
  }
};

export const StatsTab: React.FC = () => {
  const { group, groupType, timeRangeInDays } = useGroupStats();

  const workoutListRef = useRef<WorkoutListBottomSheetRef>(null);

  const handleViewAllWorkouts = () => {
    workoutListRef.current?.open();
  };

  const handleRankingPress = (ranking: RankingResponse) => {
    router.push({
      pathname: '/ranking-levels',
      params: { ranking: JSON.stringify(ranking) },
    });
  };

  return (
    <>
      <View style={styles.headingContainer}>
        <GroupSummaryStats
          group={group}
          groupType={groupType}
          timeRangeInDays={timeRangeInDays}
        />
        <VisualCards />
        <RankingCards
          workouts={group.runs}
          highlightedWorkout={group.highlight}
          onRankingPress={handleRankingPress}
        />
      </View>

      {group.stats.map((section, index) => (
        <CollapsibleStatSection
          key={section.title}
          section={section}
          getTabColor={getTabColor}
          alternatingBackground={index % 2 === 0}
          initialExpanded={index === 0 || index === 1}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleViewAllWorkouts}
          style={styles.viewAllButton}
          labelStyle={styles.buttonLabel}
        >
          View All {group.runs.length} Workouts
        </Button>
      </View>

      <WorkoutListBottomSheet
        ref={workoutListRef}
        workouts={group.runs}
        title={`All ${group.runs.length} Workouts`}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    marginHorizontal: 20,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    paddingBottom: 15,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  viewAllButton: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral,
  },
});
