import React from 'react';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDistance } from '@/utils/distance';
import { formatTimeMMSS } from '@/utils/time';

interface HighlightedWorkoutProps {
  timeInSeconds: number;
  distanceInUserUnit: number;
  distanceUnit: string;
}

export const HighlightedWorkout: React.FC<HighlightedWorkoutProps> = ({
  timeInSeconds,
  distanceInUserUnit,
  distanceUnit,
}) => (
  <>
    <Text
      style={{
        fontSize: 14,
        fontFamily: LatoFonts.bold,
        color: colors.background,
        marginBottom: 8,
      }}
    >
      Highlighted Workout
    </Text>
    <Text
      style={{
        fontSize: 24,
        fontFamily: LatoFonts.bold,
        color: colors.background,
        marginBottom: 4,
      }}
    >
      {formatTimeMMSS(timeInSeconds)}
    </Text>
    <Text
      style={{
        fontSize: 16,
        fontFamily: LatoFonts.regular,
        color: colors.background,
      }}
    >
      {formatDistance({ quantity: distanceInUserUnit, unit: distanceUnit }, 2)}
    </Text>
  </>
);
