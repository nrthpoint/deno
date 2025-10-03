import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HalfMoonProgress } from '@/components/Stats/HalfMoonProgress';
import { VariationBar } from '@/components/Stats/VariationBar';
import { useGroupStats } from '@/context/GroupStatsContext';
import { subheading } from '@/utils/text';
import { formatDuration } from '@/utils/time';

export const VisualCards = () => {
  const { group, meta } = useGroupStats();

  return (
    <View>
      <Text style={styles.headerText}>Key Stats</Text>
      <View style={[styles.row]}>
        <View style={styles.column}>
          <HalfMoonProgress
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
            label="Variation"
            width={150}
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    ...subheading,
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 10,
  },
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
