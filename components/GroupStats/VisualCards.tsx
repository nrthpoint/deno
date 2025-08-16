import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HalfMoonProgress } from '@/components/Stats/HalfMoonProgress';
import { VariationBar } from '@/components/Stats/VariationBar';
import { colors } from '@/config/colors';
import { formatDuration } from '@/utils/time';

import { TabContentProps } from './GroupStats.types';

export const VisualCards: React.FC<TabContentProps> = ({ group, meta, tabColor }) => {
  return (
    <View
      style={[
        styles.row,
        // { backgroundColor: tabColor ? `${tabColor.secondary}` : undefined },
      ]}
    >
      <View style={styles.column}>
        <HalfMoonProgress
          value={group.runs.length}
          total={meta.totalRuns}
          color={tabColor?.primary || '#4CAF50'}
          label="of Total Workouts"
          size={100}
          hasModal={true}
          modalIcon="moon"
          modalTitle="Workout Distribution"
          modalDescription="This shows what percentage of your total workouts fall into this specific group, for the selected time period."
          modalInfo={[
            { label: 'Total Workouts in Group', value: group.runs.length.toString() },
            { label: 'Total Workouts Overall', value: meta.totalRuns.toString() },
            { label: 'Group Ranking', value: `${group.rankLabel}` },
          ]}
        />
      </View>

      <View style={styles.column}>
        <VariationBar
          distribution={group.variantDistribution}
          color="#ffffff"
          label="Duration Variation"
          width={170}
          hasModal={true}
          modalTitle="Duration Variation"
          modalDescription="The range and distribution of workout durations in this group. Each dot is a workout."
          modalInfo={[
            { label: 'Best Time', value: formatDuration(group.highlight.duration) },
            { label: 'Worst Time', value: formatDuration(group.worst.duration) },
            {
              label: 'Variation Range',
              value: formatDuration(group.totalVariation),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 18,
    padding: 10,
    backgroundColor: colors.surface,
  },
  column: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
