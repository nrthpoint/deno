import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { AirportStatCard } from '@/components/AirportStatCard/AirportStatCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
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
    return { value: 'THIS', unit: 'WEEK' };
  } else if (timeRangeInDays <= 30) {
    return { value: 'THIS', unit: 'MONTH' };
  } else if (timeRangeInDays <= 90) {
    const months = Math.round(timeRangeInDays / 30);
    return { value: months, unit: months > 1 ? 'MONTHS' : 'MONTH' };
  } else if (timeRangeInDays <= 365) {
    const months = Math.round(timeRangeInDays / 30);
    return { value: months, unit: 'MONTHS' };
  } else {
    const years = Math.round(timeRangeInDays / 365);
    return { value: years, unit: years > 1 ? 'YEARS' : 'YEAR' };
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

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>SUMMARY</Text>

      <View style={styles.cardGrid}>
        <AirportStatCard
          label="TOTAL RUNS"
          value={runCount}
        />

        <AirportStatCard
          label="TIME PERIOD"
          value={timeRangeParts.value}
          unit={timeRangeParts.unit}
        />

        <AirportStatCard
          label="FIRST RUN"
          value={firstRunDaysAgo}
          unit="DAYS AGO"
        />

        <AirportStatCard
          label="LAST RUN"
          value={lastRunDaysAgo}
          unit="DAYS AGO"
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
