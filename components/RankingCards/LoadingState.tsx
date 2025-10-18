import React from 'react';
import { ActivityIndicator, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

export const LoadingState: React.FC = () => (
  <>
    <Text
      style={{
        fontSize: 14,
        fontFamily: LatoFonts.bold,
        color: colors.background,
        marginBottom: 8,
      }}
    >
      Getting Ranking...
    </Text>
    <ActivityIndicator
      size="small"
      color={colors.neutral}
    />
  </>
);
