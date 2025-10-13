import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import {
  RankingResponse,
  getLevelColor,
  getLevelIntensity,
  rankingService,
} from '@/services/rankingService';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { uppercase } from '@/utils/text';

interface RankingCardsProps {
  workout?: ExtendedWorkout;
  onRankingPress: (ranking: RankingResponse) => void;
}

const getRankingIcon = (level: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (level) {
    case 'Elite':
      return 'crown';
    case 'Advanced':
      return 'medal';
    case 'Intermediate':
      return 'trophy-variant';
    case 'Beginner':
      return 'star';
    default:
      return 'run';
  }
};

export const RankingCards: React.FC<RankingCardsProps> = ({ workout, onRankingPress }) => {
  const { age, gender, distanceUnit } = useSettings();
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState<RankingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const timeInSeconds = workout?.duration?.quantity || 0;
  const distanceInUserUnit = workout?.distance.quantity || 0;

  useEffect(() => {
    const fetchRanking = async () => {
      if (
        !workout ||
        !age ||
        !gender ||
        ranking ||
        timeInSeconds === 0 ||
        distanceInUserUnit === 0
      ) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const rankingResult = await rankingService.getRanking({
          age,
          distance: distanceInUserUnit,
          unit: distanceUnit === 'mi' ? 'mile' : 'km',
          time: timeInSeconds,
          gender,
        });
        setRanking(rankingResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get ranking');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [workout, age, gender, distanceUnit, timeInSeconds, distanceInUserUnit, ranking]);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No highlighted workout available</Text>
      </View>
    );
  }

  if (!age || !gender) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Set your age and gender in settings to see ranking</Text>
      </View>
    );
  }

  const handlePress = () => {
    if (ranking) {
      onRankingPress(ranking);
    }
  };

  const levelColor = ranking ? getLevelColor(ranking.level) : colors.surface;
  const intensity = ranking ? getLevelIntensity(ranking.level) : 0.1;

  const RankingDisplay = ({ ranking }: { ranking: RankingResponse }) => (
    <View
      style={{
        alignItems: 'flex-start',
        display: 'flex',
        //gap: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>{ranking.level}</Text>

        <Text style={styles.rankText}>Rank #{ranking.rank}</Text>
        <Text style={styles.percentileText}>
          Top {(100 - ranking.better_than_percent).toFixed(1)}%
        </Text>
      </View>
      <View style={{}}>
        <MaterialCommunityIcons
          name={getRankingIcon(ranking.level)}
          size={38}
          color={colors.background}
          style={styles.levelIcon}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Card
        style={[
          styles.card,
          ranking && {
            backgroundColor: `${levelColor}${Math.round(intensity * 255)
              .toString(16)
              .padStart(2, '0')}`,
            borderColor: levelColor,
            borderWidth: 2,
          },
        ]}
        onPress={handlePress}
      >
        <Card.Content style={styles.cardContent}>
          <View style={styles.dataContainer}>
            {loading ? (
              <>
                <Text style={styles.titleText}>Getting Ranking...</Text>
                <ActivityIndicator
                  size="small"
                  color={colors.neutral}
                />
              </>
            ) : error ? (
              <>
                <Text style={styles.titleText}>Error</Text>
                <Text style={styles.errorText}>{error}</Text>
              </>
            ) : ranking ? (
              <>
                <RankingDisplay ranking={ranking} />
              </>
            ) : (
              <>
                <Text style={styles.titleText}>Highlighted Workout</Text>
                <Text style={styles.timeText}>
                  {Math.floor(timeInSeconds / 60)}:
                  {(timeInSeconds % 60).toFixed(0).padStart(2, '0')}
                </Text>
                <Text style={styles.distanceText}>
                  {distanceInUserUnit.toFixed(2)}
                  {distanceUnit}
                </Text>
              </>
            )}
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
    paddingVertical: 20,
  },
  card: {
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  dataContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  distanceText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.background,
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
  errorText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#f32121',
    textAlign: 'center',
  },
  levelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    //gap: 8,
  },
  levelIcon: {
    marginRight: 4,
  },
});
