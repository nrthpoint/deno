import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import {
  calculateTimeDifference,
  calculateWorkoutSplits,
  formatSplitPace,
  formatSplitTime,
  WorkoutSplit,
} from '@/utils/splits';

interface SplitComparisonProps {
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
}

export const SplitComparison: React.FC<SplitComparisonProps> = ({
  sample1,
  sample2,
  sample1Label,
  sample2Label,
}) => {
  const [splits1, setSplits1] = useState<WorkoutSplit[]>([]);
  const [splits2, setSplits2] = useState<WorkoutSplit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSplits = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [workout1Splits, workout2Splits] = await Promise.all([
          calculateWorkoutSplits(sample1),
          calculateWorkoutSplits(sample2),
        ]);

        setSplits1(workout1Splits);
        setSplits2(workout2Splits);
      } catch (err) {
        setError('Failed to calculate splits from route data');
        console.error('Error fetching splits:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSplits();
  }, [sample1, sample2]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
        <Text style={styles.loadingText}>Calculating splits...</Text>
      </View>
    );
  }

  if (error || splits1.length === 0 || splits2.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No route data available for split comparison'}
        </Text>
      </View>
    );
  }

  const maxSplits = Math.max(splits1.length, splits2.length);
  const distanceUnit = splits1[0]?.distanceUnit || 'mi';

  const renderSplitRow = (splitIndex: number) => {
    const split1 = splits1[splitIndex];
    const split2 = splits2[splitIndex];
    const splitNumber = splitIndex + 1;

    let timeDiff: { diff: number; isPositive: boolean; formatted: string } | null = null;
    let paceDiff: { diff: number; isPositive: boolean; formatted: string } | null = null;

    if (split1 && split2) {
      timeDiff = calculateTimeDifference(split1.duration, split2.duration);
      paceDiff = calculateTimeDifference(split1.pace, split2.pace);
    }

    return (
      <View
        key={splitIndex}
        style={styles.splitRow}
      >
        <View style={styles.splitNumberColumn}>
          <Text style={styles.splitNumber}>{splitNumber}</Text>
        </View>

        <View style={styles.dataColumn}>
          <Text style={styles.sampleLabel}>{sample1Label}</Text>
          {split1 ? (
            <>
              <Text style={styles.timeValue}>{formatSplitTime(split1.duration)}</Text>
              <Text style={styles.paceValue}>{formatSplitPace(split1.pace, distanceUnit)}</Text>
            </>
          ) : (
            <Text style={styles.noDataText}>-</Text>
          )}
        </View>

        <View style={styles.dataColumn}>
          <Text style={styles.sampleLabel}>{sample2Label}</Text>
          {split2 ? (
            <>
              <Text style={styles.timeValue}>{formatSplitTime(split2.duration)}</Text>
              <Text style={styles.paceValue}>{formatSplitPace(split2.pace, distanceUnit)}</Text>
            </>
          ) : (
            <Text style={styles.noDataText}>-</Text>
          )}
        </View>

        <View style={styles.diffColumn}>
          <Text style={styles.diffLabel}>Diff</Text>
          {timeDiff ? (
            <>
              <Text style={[styles.diffValue, timeDiff.isPositive ? styles.slower : styles.faster]}>
                {timeDiff.isPositive ? '+' : '-'}
                {timeDiff.formatted}
              </Text>
              <Text style={[styles.diffPace, paceDiff?.isPositive ? styles.slower : styles.faster]}>
                {paceDiff?.isPositive ? '+' : '-'}
                {paceDiff?.formatted}/{distanceUnit}
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>-</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Split Comparison</Text>
        <Text style={styles.subtitle}>
          Time and pace per {distanceUnit === 'mi' ? 'mile' : 'kilometer'}
        </Text>
        <Text style={styles.calculationMethod}>
          {splits1.length > 0 && splits1[0].startTime
            ? 'Using workout segment data'
            : 'Using GPS route data'}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={styles.splitNumberColumn}>
            <Text style={styles.headerText}>Split</Text>
          </View>
          <View style={styles.dataColumn}>
            <Text style={styles.headerText}>{sample1Label}</Text>
          </View>
          <View style={styles.dataColumn}>
            <Text style={styles.headerText}>{sample2Label}</Text>
          </View>
          <View style={styles.diffColumn}>
            <Text style={styles.headerText}>Difference</Text>
          </View>
        </View>

        {Array.from({ length: maxSplits }, (_, index) => renderSplitRow(index))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendText}>
          <Text style={styles.faster}>Green</Text> = {sample1Label} faster •{' '}
          <Text style={styles.slower}>Red</Text> = {sample2Label} faster
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  calculationMethod: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    fontStyle: 'italic',
    marginTop: 4,
  },
  table: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHighlight,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  splitRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  splitNumberColumn: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataColumn: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  diffColumn: {
    width: 80,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  splitNumber: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  sampleLabel: {
    fontSize: 10,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginBottom: 2,
    textAlign: 'center',
  },
  timeValue: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 2,
  },
  paceValue: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  diffLabel: {
    fontSize: 10,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginBottom: 2,
    textAlign: 'center',
  },
  diffValue: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    marginBottom: 2,
  },
  diffPace: {
    fontSize: 10,
    fontFamily: LatoFonts.regular,
  },
  faster: {
    color: colors.tertiary,
  },
  slower: {
    color: '#ff1744',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  legend: {
    padding: 16,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
});
