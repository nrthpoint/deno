import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useRanking } from '@/hooks/useRanking';
import { RankingResponse, getLevelColor, getLevelIntensity } from '@/services/rankingService';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';
import { uppercase } from '@/utils/text';

import { ErrorState } from './ErrorState';
import { HighlightedWorkout } from './HighlightedWorkout';
import { LoadingState } from './LoadingState';

interface RankingCardsProps {
  workout?: ExtendedWorkout;
  group?: Group;
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

export const RankingCards: React.FC<RankingCardsProps> = ({ workout, group, onRankingPress }) => {
  const { age, gender, distanceUnit } = useSettings();
  const rankingMutation = useRanking(group);

  const timeInSeconds = workout?.duration?.quantity || 0;
  const distanceInUserUnit = workout?.distance.quantity || 0;

  useEffect(() => {
    const shouldFetchRanking =
      workout &&
      age &&
      gender &&
      timeInSeconds > 0 &&
      distanceInUserUnit > 0 &&
      !rankingMutation.data &&
      !rankingMutation.isPending;

    if (shouldFetchRanking) {
      rankingMutation.mutate({
        age,
        distance: distanceInUserUnit,
        unit: distanceUnit === 'mi' ? 'mile' : 'km',
        time: timeInSeconds,
        gender,
      });
    }
  }, [
    workout,
    age,
    gender,
    distanceUnit,
    timeInSeconds,
    distanceInUserUnit,
    group?.key,
    rankingMutation,
  ]);

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
    if (rankingMutation.data) {
      onRankingPress(rankingMutation.data);
    }
  };

  const levelColor = rankingMutation.data
    ? getLevelColor(rankingMutation.data.level)
    : colors.surface;
  const intensity = rankingMutation.data ? getLevelIntensity(rankingMutation.data.level) : 0.1;

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
          Top {(100 - ranking.betterThanPercent).toFixed(1)}%
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
          rankingMutation.data && {
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
            {rankingMutation.isPending ? (
              <LoadingState />
            ) : rankingMutation.error ? (
              <ErrorState error={rankingMutation.error.message} />
            ) : rankingMutation.data ? (
              <RankingDisplay ranking={rankingMutation.data} />
            ) : (
              <HighlightedWorkout
                timeInSeconds={timeInSeconds}
                distanceInUserUnit={distanceInUserUnit}
                distanceUnit={distanceUnit}
              />
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

  levelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    //gap: 8,
  },
  levelIcon: {
    marginRight: 4,
  },
});
