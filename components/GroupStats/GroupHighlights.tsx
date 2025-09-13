import React from 'react';
import { StyleSheet, View } from 'react-native';

import { HalfMoonProgress } from '@/components/Stats/HalfMoonProgress';
import { VariationBar } from '@/components/Stats/VariationBar';
import { formatDuration } from '@/utils/time';

import { TabContentProps } from './GroupStats.types';

export const VisualCards = ({ group, meta }: Pick<TabContentProps, 'group' | 'meta'>) => {
  return (
    <View style={[styles.row]}>
      <View style={styles.column}>
        <HalfMoonProgress
          value={group.runs.length}
          total={meta.totalRuns}
          label="of Workouts"
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
          label="Variation"
          width={150}
          groupType={group.type}
          hasModal={true}
          modalTitle={group.type === 'pace' ? 'Distance Variation' : 'Duration Variation'}
          modalDescription={
            group.type === 'pace'
              ? 'The range and distribution of workout distances in this group. Each dot is a workout.'
              : 'The range and distribution of workout durations in this group. Each dot is a workout.'
          }
          modalInfo={[
            { label: 'Best Time', value: formatDuration(group.highlight.duration) },
            { label: 'Worst Time', value: formatDuration(group.worst.duration) },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
  },
});
