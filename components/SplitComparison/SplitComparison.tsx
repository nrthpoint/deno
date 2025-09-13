import { LengthUnit } from '@kingstinct/react-native-healthkit';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import {
  calculateSplitsForWorkout,
  calculateTimeDifference,
  formatSplitPace,
  formatSplitTime,
  WorkoutSplit,
} from '@/utils/workoutSplits';

interface SplitComparisonProps {
  sample1: ExtendedWorkout;
  sample2: ExtendedWorkout;
  sample1Label: string;
  sample2Label: string;
  distanceUnit: LengthUnit;
}

export const SplitComparison: React.FC<SplitComparisonProps> = ({
  sample1,
  sample2,
  sample1Label,
  sample2Label,
  distanceUnit,
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
          calculateSplitsForWorkout(sample1, distanceUnit),
          calculateSplitsForWorkout(sample2, distanceUnit),
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
  }, [sample1, sample2, distanceUnit]);

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
  const splitDistanceUnit = splits1[0]?.distanceUnit || distanceUnit;

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
        style={[styles.splitRow, splitIndex === maxSplits - 1 && { borderBottomWidth: 0 }]}
      >
        <View style={styles.splitNumberColumn}>
          <Text style={styles.splitNumber}>{splitNumber}</Text>
        </View>

        <View style={styles.dataColumn}>
          {/* <Text style={styles.sampleLabel}>{sample1Label}</Text> */}
          {split1 ? (
            <>
              <Text style={styles.timeValue}>{formatSplitTime(split1.duration)}</Text>
              <Text style={styles.paceValue}>
                {formatSplitPace(split1.pace, splitDistanceUnit)}
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>-</Text>
          )}
        </View>

        <View style={styles.dataColumn}>
          {/* <Text style={styles.sampleLabel}>{sample2Label}</Text> */}
          {split2 ? (
            <>
              <Text style={styles.timeValue}>{formatSplitTime(split2.duration)}</Text>
              <Text style={styles.paceValue}>
                {formatSplitPace(split2.pace, splitDistanceUnit)}
              </Text>
            </>
          ) : (
            <Text style={styles.noDataText}>-</Text>
          )}
        </View>

        <View style={styles.diffColumn}>
          {/* <Text style={styles.diffLabel}>Diff</Text> */}
          {timeDiff ? (
            <>
              <Text style={[styles.diffValue, timeDiff.isPositive ? styles.slower : styles.faster]}>
                {timeDiff.isPositive ? '+' : '-'}
                {timeDiff.formatted}
              </Text>
              <Text style={[styles.diffPace, paceDiff?.isPositive ? styles.slower : styles.faster]}>
                {paceDiff?.isPositive ? '+' : '-'}
                {paceDiff?.formatted}/{splitDistanceUnit}
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
      {/* <View style={styles.header}>
        <Text style={styles.title}>Split Comparison</Text>
        <Text style={styles.subtitle}>
          Time and pace per {splitDistanceUnit === 'mi' ? 'mile' : 'kilometer'}
        </Text>
        <Text style={styles.calculationMethod}>
          {splits1.length > 0 && splits1[0].startTime
            ? 'Using workout segment data'
            : 'Using GPS route data'}
        </Text>
      </View> */}

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
    fontStyle: 'italic',
    marginTop: 4,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  splitRow: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
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
    justifyContent: 'center',
  },
  diffColumn: {
    width: 80,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
  },
  splitNumber: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: '#CCCCCC',
  },
  // sampleLabel: {
  //   fontSize: 10,
  //   fontFamily: LatoFonts.regular,
  //   color: colors.lightGray,
  //   marginBottom: 2,
  //   textAlign: 'center',
  // },
  timeValue: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  paceValue: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: '#CCCCCC',
  },
  // diffLabel: {
  //   fontSize: 10,
  //   fontFamily: LatoFonts.regular,
  //   color: colors.lightGray,
  //   marginBottom: 2,
  //   textAlign: 'center',
  // },
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
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: '#CCCCCC',
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
