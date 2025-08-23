import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { PredictedWorkout } from '@/types/Prediction';
import { subheading } from '@/utils/text';
import { formatDuration } from '@/utils/time';

interface PredictionCardProps {
  prediction: PredictedWorkout;
  title: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, title }) => {
  return (
    <Card>
      <View style={styles.predictionCard}>
        <Text style={styles.predictionTitle}>{title}</Text>

        <Text style={styles.predictionPace}>
          {prediction.predictedPace.quantity.toFixed(2)} {prediction.predictedPace.unit}
        </Text>

        <Text style={styles.predictionTime}>{formatDuration(prediction.predictedDuration)}</Text>

        <View style={styles.metricsContainer}>
          <View style={styles.metricGroup}>
            <Text style={[styles.metricIcon, { color: '#FFD700' }]}>★</Text>
            <Text style={styles.predictionConfidence}>
              {prediction.confidenceLevel.charAt(0).toUpperCase() +
                prediction.confidenceLevel.slice(1)}
            </Text>
          </View>

          <View style={[styles.metricGroup, { justifyContent: 'flex-end' }]}>
            <Text style={[styles.metricIcon, { color: '#4CAF50' }]}>⬆️</Text>
            <Text style={styles.predictionImprovement}>
              +{prediction.improvementPercentage.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  predictionCard: {
    margin: 10,
    padding: 20,
    borderRadius: 8,
  },
  predictionTitle: {
    ...subheading,
    textAlign: 'center',
  },
  predictionPace: {
    color: colors.neutral,
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 10,
    marginBottom: 10,
  },
  predictionTime: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    marginBottom: 10,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  metricGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  predictionConfidence: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
  },
  predictionImprovement: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
  },
});
