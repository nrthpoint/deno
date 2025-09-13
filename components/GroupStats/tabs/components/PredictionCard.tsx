import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { useTheme } from '@/context/ThemeContext';
import { PredictedWorkout } from '@/types/Prediction';
import { subheading } from '@/utils/text';
import { formatDuration, formatPace } from '@/utils/time';

interface PredictionCardProps {
  prediction: PredictedWorkout;
  title: string;
  subtitle: string;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({ prediction, title, subtitle }) => {
  const { colorProfile } = useTheme();

  return (
    <Card>
      <View style={styles.container}>
        <View style={[styles.predictionHeader, { backgroundColor: colorProfile.primary }]}>
          <Text style={styles.predictionPrefix}>IN</Text>
          <Text style={styles.predictionTitle}>{title}</Text>
          <Text style={styles.predictionSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.predictionDetails}>
          <Text style={styles.predictionLabel}>Expected Pace</Text>
          <Text style={styles.predictionValue}>{formatPace(prediction.predictedPace)}</Text>

          <Text style={styles.predictionLabel}>Expected Duration</Text>
          <Text style={styles.predictionValue}>{formatDuration(prediction.predictedDuration)}</Text>
        </View>

        {/* <View style={styles.metricsContainer}>
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
        </View> */}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  predictionHeader: {
    borderRadius: 8,
    overflow: 'hidden',
    width: 150,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    paddingVertical: 10,
    height: '100%',
  },
  predictionDetails: {
    flex: 1,
    marginBottom: 10,
  },
  predictionPrefix: {
    ...subheading,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 0,
    marginTop: 0,
    fontWeight: '600',
  },
  predictionTitle: {
    marginTop: 5,
    fontFamily: 'OrelegaOne',
    fontSize: 34,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  predictionSubtitle: {
    ...subheading,
    marginTop: 5,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  predictionValue: {
    // ...subheading,
    color: '#FFFFFF',
    marginTop: 0,
    marginBottom: 10,
    fontWeight: '600',
  },
  predictionLabel: {
    ...subheading,
    color: colors.lightGray,
    //marginTop: 10,
    marginBottom: 10,
  },
  // metricsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginTop: 10,
  // },
  // metricGroup: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   flex: 1,
  // },
  // metricIcon: {
  //   fontSize: 16,
  //   marginRight: 6,
  // },
  // predictionConfidence: {
  //   color: '#CCCCCC',
  //   fontSize: 14,
  //   fontFamily: LatoFonts.regular,
  // },
  // predictionImprovement: {
  //   color: '#4CAF50',
  //   fontSize: 14,
  //   fontFamily: LatoFonts.regular,
  // },
});
