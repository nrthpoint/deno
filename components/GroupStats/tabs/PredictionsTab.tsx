import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NoPredictionsMessage } from '@/components/GroupStats/tabs/components/NoPredictionsMessage';
import { PredictionCard } from '@/components/GroupStats/tabs/components/PredictionCard';
import { TabHeader } from '@/components/GroupStats/tabs/components/TabHeader';
import { useGroupStats } from '@/context/GroupStatsContext';

export const PredictionsTab: React.FC = () => {
  const { group } = useGroupStats();
  const hasPredictions = group.predictions.prediction4Week || group.predictions.prediction12Week;

  return (
    <View style={styles.container}>
      {hasPredictions ? (
        <>
          <TabHeader
            title="Predictions"
            description="Compare your predicted performance over the next 4 and 12 weeks."
          />

          {/* 4-Week Prediction */}
          {group.predictions.prediction4Week && (
            <PredictionCard
              prediction={group.predictions.prediction4Week}
              title="4"
              subtitle="Weeks"
            />
          )}

          {/* 12-Week Prediction */}
          {group.predictions.prediction12Week && (
            <PredictionCard
              prediction={group.predictions.prediction12Week}
              title="3"
              subtitle="Months"
            />
          )}
        </>
      ) : (
        <NoPredictionsMessage />
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
});
