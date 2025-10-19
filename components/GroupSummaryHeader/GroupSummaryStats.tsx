import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AirportStatCard } from '@/components/AirportStatCard/AirportStatCard';
import { RankCard } from '@/components/RankCard/RankCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { Ranking } from '@/services/rankingService/types';
import { Group, GroupType } from '@/types/Groups';
import { uppercase } from '@/utils/text';

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

const getTimeRangeParts = (timeRangeInDays: number): { value: number | string; unit: string } => {
  if (timeRangeInDays <= 7) {
    return { value: 'this', unit: 'week' };
  } else if (timeRangeInDays <= 30) {
    return { value: 'this', unit: 'month' };
  } else if (timeRangeInDays <= 90) {
    const months = Math.round(timeRangeInDays / 30);
    return { value: months, unit: months > 1 ? 'months' : 'month' };
  } else if (timeRangeInDays <= 365) {
    const months = Math.round(timeRangeInDays / 30);
    return { value: months, unit: 'months' };
  } else {
    const years = Math.round(timeRangeInDays / 365);
    return { value: years, unit: years > 1 ? 'years' : 'year' };
  }
};

export const GroupSummaryStats: React.FC<GroupSummaryStatsProps> = ({
  group,
  groupType: _groupType,
  timeRangeInDays,
}) => {
  const runCount = group.runs.length;
  const timeRangeParts = getTimeRangeParts(timeRangeInDays);
  const firstRunDaysAgo = formatDaysAgo(group.oldest.endDate);
  const lastRunDaysAgo = formatDaysAgo(group.mostRecent.endDate);

  const handleRankingPress = (ranking: Ranking) => {
    router.push({
      pathname: '/ranking-levels',
      params: {
        ranking: JSON.stringify(ranking),
        distance: group.highlight.distance.quantity.toFixed(2),
        duration: group.highlight.duration.quantity.toFixed(2),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SUMMARY</Text>

      <RankCard
        workout={group.highlight}
        onRankingPress={handleRankingPress}
      />

      <View style={styles.cardGrid}>
        <AirportStatCard
          unit="runs"
          value={runCount}
        />

        <AirportStatCard
          value={timeRangeParts.value}
          unit={timeRangeParts.unit}
        />

        <AirportStatCard
          label="Most Recent"
          value={lastRunDaysAgo}
          unit="DAYS AGO"
          backgroundColor={colors.background}
          inverted
        />

        <AirportStatCard
          label="Oldest"
          value={firstRunDaysAgo}
          unit="DAYS AGO"
          backgroundColor={colors.background}
          inverted
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  heading: {
    ...uppercase,
    fontSize: 14,
    color: colors.neutral,
    marginBottom: 20,
    marginTop: 10,
    letterSpacing: 2,
    fontFamily: LatoFonts.bold,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
