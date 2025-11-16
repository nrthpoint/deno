import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ConsistencyModalContent } from '@/components/Stats/ConsistencyModalContent';
import { ConsistencyScore } from '@/components/Stats/ConsistencyScore';
import { HalfMoonProgress } from '@/components/Stats/HalfMoonProgress';
import { useGroupStats } from '@/context/GroupStatsContext';
import { getConsistencyMetricLabel } from '@/grouping-engine/services/consistencyValueExtractor';

export const VisualCards = () => {
  const { group, meta } = useGroupStats();
  const metricLabel = getConsistencyMetricLabel(group.type);

  return (
    <View>
      <View style={[styles.row]}>
        <View style={styles.column}>
          <HalfMoonProgress
            label="Of All Runs"
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
          <ConsistencyScore
            label="Consistency"
            hasModal={true}
            modalIcon="stats-chart"
            modalTitle={`${metricLabel} Consistency`}
            modalChildren={<ConsistencyModalContent />}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
    flex: 1,
  },
  column: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
});
