import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useRanking } from '@/hooks/useRanking';
import { Ranking } from '@/services/rankingService/types';
import { getLevelColor, getLevelIntensity, getRankingIcon } from '@/services/rankingService/utils';
import { uppercase } from '@/utils/text';

interface YourPerformanceCardProps {
  distance: number;
  unit: 'km' | 'mile';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  time: number;
  onPress?: (ranking: Ranking) => void;
}

export const YourPerformanceCard: React.FC<YourPerformanceCardProps> = ({
  distance,
  unit,
  age,
  gender,
  time,
  onPress,
}) => {
  const {
    data: ranking,
    isLoading,
    error,
  } = useRanking({
    distance,
    unit,
    age,
    gender,
    time,
  });

  if (isLoading) {
    return (
      <Card style={styles.loadingCard}>
        <View style={styles.cardContent}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={colors.primary}
            />
            <Text style={styles.loadingText}>Loading your performance...</Text>
          </View>
        </View>
      </Card>
    );
  }

  if (error || !ranking) {
    return (
      <Card style={styles.errorCard}>
        <View style={styles.cardContent}>
          <Text style={styles.errorText}>
            {error?.message || 'Unable to load your performance data'}
          </Text>
        </View>
      </Card>
    );
  }

  const handlePress = () => {
    if (onPress && ranking) {
      onPress(ranking);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Card
        style={{
          ...styles.yourPerformanceCard,
          backgroundColor: `${getLevelColor(ranking.level)}${Math.round(
            getLevelIntensity(ranking.level) * 255,
          )
            .toString(16)
            .padStart(2, '0')}`,
          borderColor: getLevelColor(ranking.level),
        }}
      >
        <View style={styles.cardContent}>
          <View style={styles.performanceContainer}>
            <View style={styles.performanceInfo}>
              <Text style={styles.levelText}>{ranking.level}</Text>
              <Text style={styles.rankText}>RANK #{ranking.rank}</Text>
              <Text style={styles.percentileText}>
                Top {(100 - ranking.betterThanPercent).toFixed(1)}%
              </Text>
            </View>
            <MaterialCommunityIcons
              name={getRankingIcon(ranking.level)}
              size={38}
              color={colors.background}
              style={styles.performanceIcon}
            />
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  yourPerformanceCard: {
    marginBottom: 24,
    borderWidth: 2,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  errorCard: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
  performanceContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  rankText: {
    ...uppercase,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 6,
  },
  percentileText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.8,
  },
  performanceIcon: {
    marginRight: 4,
  },
});
