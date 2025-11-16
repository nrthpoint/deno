import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { ModalProvider } from '@/components/Modal/Modal';
import { ModalProps } from '@/components/Modal/Modal.types';
import { CircularProgress } from '@/components/Stats/CircularProgress';
import { getLatoFont } from '@/config/fonts';
import { useGroupStats } from '@/context/GroupStatsContext';

interface RunPercentageProps extends ModalProps {
  label: string;
}

/**
 * RunPercentage - Displays run percentage as a circular progress indicator
 *
 * Wrapper component that:
 * - Fetches group runs and total runs from GroupStatsContext
 * - Calculates percentage of runs in the group
 * - Renders using CircularProgress component with themed gradient
 * - Provides modal content showing the percentage
 */
export const RunPercentage = ({ label, ...modalProps }: RunPercentageProps) => {
  const { group, meta } = useGroupStats();
  const value = group?.runs?.length ?? 0;
  const total = meta?.totalRuns ?? 0;
  const percentage = total > 0 ? Math.round(Math.min((value / total) * 100, 100)) : 0;

  const modalContent = <Text style={styles.modalValue}>{percentage}%</Text>;

  return (
    <ModalProvider
      {...modalProps}
      modalChildren={modalContent}
    >
      <CircularProgress
        percentage={percentage}
        label={label}
      />
    </ModalProvider>
  );
};

const styles = StyleSheet.create({
  modalValue: {
    ...getLatoFont('bold'),
    color: '#FFFFFF',
    fontSize: 28,
    marginBottom: 16,
  },
});
