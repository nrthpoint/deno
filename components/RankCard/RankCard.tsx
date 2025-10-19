import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { YourPerformanceCard } from '@/components/RankingLevels';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { Ranking } from '@/services/rankingService/types';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { Group } from '@/types/Groups';

interface RankingCardsProps {
  workout?: ExtendedWorkout;
  group?: Group;
  onRankingPress: (ranking: Ranking) => void;
}

export const RankCard: React.FC<RankingCardsProps> = ({ workout, onRankingPress }) => {
  const { age, gender, distanceUnit } = useSettings();

  const timeInSeconds = workout?.duration?.quantity || 0;
  const distanceInUserUnit = workout?.distance.quantity || 0;

  const shouldShowRanking = workout && age && gender && timeInSeconds > 0 && distanceInUserUnit > 0;

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No highlighted workout available</Text>
      </View>
    );
  }

  if (!shouldShowRanking) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Set your age and gender in settings to see ranking</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <YourPerformanceCard
        distance={distanceInUserUnit}
        unit={distanceUnit === 'mi' ? 'mile' : 'km'}
        age={age || 0}
        gender={gender || 'Male'}
        time={timeInSeconds}
        onPress={onRankingPress}
      />
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
});
