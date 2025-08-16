import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDuration } from '@/utils/time';

export const PredictionsTab: React.FC<TabContentProps> = ({ group }) => {
  return (
    <View style={styles.container}>
      {group.predictions.prediction4Week || group.predictions.prediction12Week ? (
        <>
          <Text style={styles.sectionHeader}>Performance Predictions</Text>

          {/* 4-Week Prediction */}
          {group.predictions.prediction4Week && (
            <View style={styles.predictionCard}>
              <Text style={styles.predictionTitle}>4-Week Target</Text>
              <Text style={styles.predictionPace}>
                {group.predictions.prediction4Week.predictedPace.quantity.toFixed(2)}{' '}
                {group.predictions.prediction4Week.predictedPace.unit}
              </Text>
              <Text style={styles.predictionTime}>
                {formatDuration(group.predictions.prediction4Week.predictedDuration)}
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 16, marginRight: 6, color: '#FFD700' }}>★</Text>
                  <Text style={styles.predictionConfidence}>
                    {group.predictions.prediction4Week.confidenceLevel.charAt(0).toUpperCase() +
                      group.predictions.prediction4Week.confidenceLevel.slice(1)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6, color: '#4CAF50' }}>⬆️</Text>
                  <Text style={styles.predictionImprovement}>
                    +{group.predictions.prediction4Week.improvementPercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* 12-Week Prediction */}
          {group.predictions.prediction12Week && (
            <View style={styles.predictionCard}>
              <Text style={styles.predictionTitle}>12-Week Target</Text>
              <Text style={styles.predictionPace}>
                {group.predictions.prediction12Week.predictedPace.quantity.toFixed(2)}{' '}
                {group.predictions.prediction12Week.predictedPace.unit}
              </Text>
              <Text style={styles.predictionTime}>
                {formatDuration(group.predictions.prediction12Week.predictedDuration)}
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <Text style={{ fontSize: 16, marginRight: 6, color: '#FFD700' }}>★</Text>
                  <Text style={styles.predictionConfidence}>
                    {group.predictions.prediction12Week.confidenceLevel.charAt(0).toUpperCase() +
                      group.predictions.prediction12Week.confidenceLevel.slice(1)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'flex-end',
                  }}
                >
                  <Text style={{ fontSize: 16, marginRight: 6, color: '#4CAF50' }}>⬆️</Text>
                  <Text style={styles.predictionImprovement}>
                    +{group.predictions.prediction12Week.improvementPercentage.toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {group.predictions.recommendations.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Training Recommendations</Text>
              <View style={styles.recommendationsContainer}>
                {group.predictions.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </>
      ) : (
        <View style={styles.noPredictionsContainer}>
          <Text style={styles.noPredictionsText}>Not enough data for AI predictions</Text>
          <Text style={styles.noPredictionsSubtext}>
            Complete at least 2 workouts in this group to see AI-powered predictions and training
            recommendations.
          </Text>
        </View>
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
  sectionHeader: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginVertical: 20,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  predictionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  predictionTitle: {
    color: colors.neutral,
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  predictionPace: {
    color: '#4CAF50',
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginBottom: 5,
  },
  predictionTime: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    marginBottom: 10,
  },
  predictionConfidence: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    marginBottom: 5,
  },
  predictionImprovement: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
  },
  recommendationsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#fff',
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    flex: 1,
    lineHeight: 28,
  },
  noPredictionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 30,
    marginHorizontal: 5,
    marginVertical: 20,
    alignItems: 'center',
  },
  noPredictionsText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginBottom: 10,
  },
  noPredictionsSubtext: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
});
