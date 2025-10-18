import React from 'react';
import { Text } from 'react-native-paper';

import { LatoFonts } from '@/config/fonts';

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => (
  <>
    <Text
      style={{
        fontSize: 14,
        fontFamily: LatoFonts.bold,
        color: '#f32121',
        marginBottom: 8,
      }}
    >
      Error
    </Text>
    <Text
      style={{
        fontSize: 12,
        fontFamily: LatoFonts.regular,
        color: '#f32121',
        textAlign: 'center',
      }}
    >
      {error}
    </Text>
  </>
);
