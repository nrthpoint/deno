import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface TrainingRecommendationsProps {
  recommendations: string[];
}

export const TrainingRecommendations: React.FC<TrainingRecommendationsProps> = ({
  recommendations,
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={styles.sectionHeader}>Training Recommendations</Text>

      <View style={styles.recommendationsContainer}>
        {recommendations.map((recommendation, index) => (
          <View
            key={index}
            style={styles.recommendationItem}
          >
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
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
});
