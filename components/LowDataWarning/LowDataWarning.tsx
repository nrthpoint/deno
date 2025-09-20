import { router } from 'expo-router';
import React from 'react';

import { Warning } from '@/components/Warning';

interface LowDataWarningProps {
  message: string;
}

export const LowDataWarning: React.FC<LowDataWarningProps> = ({ message }) => {
  const handlePress = () => {
    router.push('/settings?section=general');
  };

  return (
    <Warning
      title="Not much data!"
      message={message}
      onPress={handlePress}
      actionHint="Tap to adjust time range"
      variant="touchable"
    />
  );
};
