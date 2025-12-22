import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AirportStatCard } from '@/components/AirportStatCard/AirportStatCard';
import { WorkoutPerformanceCard } from '@/components/RankingLevels/WorkoutPerformanceCard';
import { ThemedGradient } from '@/components/ThemedGradient/ThemedGradient';
import { Ranking } from '@/services/rankingService/types';
import { Group, GroupType } from '@/types/Groups';

interface GroupSummaryStatsProps {
  group: Group;
  groupType: GroupType;
  timeRangeInDays: number;
  onViewAllWorkouts?: () => void;
}

const formatDaysAgo = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const GroupSummaryStats: React.FC<GroupSummaryStatsProps> = ({
  group,
  onViewAllWorkouts,
}) => {
  const runCount = group.runs.length;
  const lastRunDaysAgo = formatDaysAgo(group.mostRecent.endDate);

  const handleRankingPress = (ranking: Ranking) => {
    router.push({
      pathname: '/ranking-levels',
      params: {
        ranking: JSON.stringify(ranking),
        distance: group.highlight.distance.quantity,
        duration: group.highlight.duration.quantity,
        unit: group.highlight.distance.unit,
      },
    });
  };

  return (
    <View style={styles.cardGrid}>
      <ThemedGradient style={styles.gradient} />

      <View style={styles.cardItem}>
        <AirportStatCard
          icon="run-fast"
          label={runCount === 1 ? 'Run' : 'Runs'}
          value={runCount}
          onPress={onViewAllWorkouts}
        />
      </View>

      <View style={styles.cardItem}>
        <WorkoutPerformanceCard
          workout={group.highlight}
          onPress={handleRankingPress}
        />
      </View>

      <View style={styles.cardItem}>
        <AirportStatCard
          icon="clock-time-four-outline"
          label={lastRunDaysAgo === 1 ? 'Day Ago' : 'Days Ago'}
          value={lastRunDaysAgo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardGrid: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardItem: {
    flex: 1,
    zIndex: 1,
  },
});
