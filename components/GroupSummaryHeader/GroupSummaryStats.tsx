import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AirportStatCard } from '@/components/AirportStatCard/AirportStatCard';
import { WorkoutPerformanceCard } from '@/components/RankingLevels/WorkoutPerformanceCard';
import { Ranking } from '@/services/rankingService/types';
import { Group, GroupType } from '@/types/Groups';

interface GroupSummaryStatsProps {
  group: Group;
  groupType: GroupType;
  timeRangeInDays: number;
}

const formatDaysAgo = (date: Date): number => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const GroupSummaryStats: React.FC<GroupSummaryStatsProps> = ({ group }) => {
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
    <View>
      <View style={styles.cardGrid}>
        <View style={styles.cardItem}>
          <WorkoutPerformanceCard
            workout={group.highlight}
            onPress={handleRankingPress}
          />
        </View>

        <View style={styles.cardItem}>
          <AirportStatCard
            icon="run-fast"
            label={runCount === 1 ? 'Run' : 'Runs'}
            value={runCount}
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
    </View>
  );
};

const styles = StyleSheet.create({
  cardGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  cardItem: {
    flex: 1,
  },
});
