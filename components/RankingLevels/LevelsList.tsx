import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useLevels } from '@/hooks/useLevels';
import { Level } from '@/services/rankingService/types';
import { getLevelColor, getLevelIntensity, getRankingIcon } from '@/services/rankingService/utils';
import { formatPace } from '@/utils/pace';
import { formatDuration } from '@/utils/time';

interface LevelCardProps {
  level: Level;
  isUserLevel?: boolean;
  distanceUnit: string;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isUserLevel }) => {
  const levelColor = getLevelColor(level.level);
  const intensity = getLevelIntensity(level.level);

  return (
    <Card
      style={{
        ...styles.levelCard,
        backgroundColor: `${levelColor}${Math.round(intensity * 255)
          .toString(16)
          .padStart(2, '0')}`,
        borderColor: levelColor,
        borderWidth: 2,
      }}
    >
      <View style={styles.levelCardContent}>
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>
              {level.level}
              {isUserLevel && ' (You)'}
            </Text>
            <Text style={styles.levelRange}>{formatDuration(level.expectedTime)}</Text>
            <Text style={styles.paceRange}>Pace: {formatPace(level.expectedPace)}</Text>
          </View>

          <MaterialCommunityIcons
            name={getRankingIcon(level.level)}
            size={38}
            color={colors.background}
            style={styles.levelIcon}
          />
        </View>
      </View>
    </Card>
  );
};

interface LevelsListProps {
  distance: number;
  unit: 'km' | 'mile';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  time: number;
  distanceUnit: string;
}

export const LevelsList: React.FC<LevelsListProps> = ({
  distance,
  unit,
  age,
  gender,
  distanceUnit,
}) => {
  const {
    data: levels,
    isLoading: levelsLoading,
    error: levelsError,
  } = useLevels({
    distance,
    unit,
    age,
    gender,
  });

  const loading = levelsLoading;
  const error = levelsError;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.loadingText}>Loading performance levels...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card style={styles.errorCard}>
        <View style={styles.cardContent}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      </Card>
    );
  }

  if (!levels) {
    return null;
  }

  return (
    <View style={styles.levelsContainer}>
      {levels.levels.map((level) => {
        //const isUserLevel = level.level.toLowerCase() === ranking.level.toLowerCase();
        return (
          <LevelCard
            key={level.level}
            level={level}
            //isUserLevel={isUserLevel}
            distanceUnit={distanceUnit === 'km' ? 'km' : 'mi'}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  levelsContainer: {
    gap: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
  levelCard: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelCardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  levelHeader: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  levelInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelName: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  levelRange: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 6,
  },
  paceRange: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.8,
  },
  levelIcon: {
    marginRight: 4,
  },
});
