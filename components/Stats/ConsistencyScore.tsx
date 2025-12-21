import React from 'react';

import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { CircularProgress } from '@/components/Stats/CircularProgress';
import { useGroupStats } from '@/context/GroupStatsContext';
import { getConsistencyColors } from '@/utils/consistencyColors';

interface ConsistencyScoreProps extends ModalProps {
  label: string;
}

/**
 * ConsistencyScore - Displays consistency score as a circular progress indicator
 *
 * Wrapper component that:
 * - Fetches consistency score from GroupStatsContext
 * - Maps score to color gradients (green=high, yellow=medium, red=low)
 * - Adjusts gradient opacity based on score
 * - Renders using CircularProgress component
 */
export const ConsistencyScore = ({ label, ...modalProps }: ConsistencyScoreProps) => {
  const { group } = useGroupStats();
  const score = group?.consistencyScore ?? 0;

  const consistencyColors = getConsistencyColors(score);

  return (
    <ModalProvider {...modalProps}>
      <CircularProgress
        percentage={score}
        label={label}
        gradientColors={consistencyColors}
        gradientOpacity={1}
      />
    </ModalProvider>
  );
};
