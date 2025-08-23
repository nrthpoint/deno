import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { NoPredictionsMessage } from '@/components/GroupStats/tabs/components/NoPredictionsMessage';
import { PredictionCard } from '@/components/GroupStats/tabs/components/PredictionCard';
import { PredictionsHeader } from '@/components/GroupStats/tabs/components/PredictionsHeader';
import { TrainingRecommendations } from '@/components/GroupStats/tabs/components/TrainingRecommendations';

export const PredictionsTab: React.FC<TabContentProps> = ({ group }) => {
  const hasPredictions = group.predictions.prediction4Week || group.predictions.prediction12Week;

  return (
    <View style={styles.container}>
      {hasPredictions ? (
        <>
          <PredictionsHeader />

          {/* 4-Week Prediction */}
          {group.predictions.prediction4Week && (
            <PredictionCard
              prediction={group.predictions.prediction4Week}
              title="4-Week Target"
            />
          )}

          {/* 12-Week Prediction */}
          {group.predictions.prediction12Week && (
            <PredictionCard
              prediction={group.predictions.prediction12Week}
              title="12-Week Target"
            />
          )}

          <TrainingRecommendations recommendations={group.predictions.recommendations} />
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
    padding: 10,
    paddingVertical: 0,
  },
});
