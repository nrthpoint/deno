import { addWeeks, format } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TabHeader } from '@/components/GroupStats/tabs/components/TabHeader';
import { ProgressionCard, ProgressionEntry } from '@/components/ProgressionCard/ProgressionCard';
import { useGroupStats } from '@/context/GroupStatsContext';
import { formatPace } from '@/utils/pace';
import { generateProgressionData } from '@/utils/progression';
import { formatDuration } from '@/utils/time';

const createPredictionEntry = (
  prediction: any,
  weeksAhead: number,
  groupType: string,
): ProgressionEntry => {
  const targetDate = addWeeks(new Date(), weeksAhead);
  const formattedDate = format(targetDate, 'MMM d, yyyy');

  let formattedValue: string;

  if (groupType === 'distance') {
    formattedValue = formatDuration(prediction.predictedDuration);
  } else {
    formattedValue = formatPace(prediction.predictedPace);
  }

  return {
    date: formattedDate,
    value: formattedValue,
    fullQuantity:
      groupType === 'distance' ? prediction.predictedDuration : prediction.predictedPace,
    isImprovement: true,
    isPredicted: true,
    distance: prediction.predictedDistance,
  };
};

export const PredictionsTab: React.FC = () => {
  const { group, groupType, timeRangeInDays } = useGroupStats();
  const progressionData = generateProgressionData(group, groupType, timeRangeInDays);

  // Create entries with predictions merged in
  const entriesWithPredictions = [...progressionData.entries];

  // Add 4-week prediction if available
  if (group.predictions.prediction4Week) {
    const predictionEntry = createPredictionEntry(group.predictions.prediction4Week, 4, groupType);
    entriesWithPredictions.unshift(predictionEntry);
  }

  // Add 12-week prediction if available
  if (group.predictions.prediction12Week) {
    const predictionEntry = createPredictionEntry(
      group.predictions.prediction12Week,
      12,
      groupType,
    );
    entriesWithPredictions.unshift(predictionEntry);
  }

  const hasData = entriesWithPredictions.length > 0;

  return (
    <View style={styles.container}>
      {hasData ? (
        <>
          <TabHeader
            title="Progression"
            description="Track your actual progression and see predicted future performance."
          />

          <ProgressionCard
            title={progressionData.title}
            description={progressionData.description}
            entries={entriesWithPredictions}
            metricLabel={progressionData.metricLabel}
            showDistanceColumn={true}
          />
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <TabHeader
            title="Progression"
            description="Complete at least 2 workouts in this group to see progression and AI-powered predictions."
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
