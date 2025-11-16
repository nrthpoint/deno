import { LengthUnit } from '@kingstinct/react-native-healthkit';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { uppercase } from '@/utils/text';
import {
  calculateSplitsForWorkout,
  formatSplitPace,
  formatSplitTime,
  WorkoutSplit,
} from '@/utils/workoutSplits';

interface WorkoutSplitsProps {
  workout: ExtendedWorkout;
  distanceUnit: LengthUnit;
}

export const WorkoutSplits: React.FC<WorkoutSplitsProps> = ({ workout, distanceUnit }) => {
  const [splits, setSplits] = useState<WorkoutSplit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSplits = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const workoutSplits = await calculateSplitsForWorkout(workout, distanceUnit);
        setSplits(workoutSplits);
      } catch (err) {
        setError('Failed to calculate splits from route data');
        console.error('Error fetching splits:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSplits();
  }, [workout, distanceUnit]);

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

  if (error || splits.length === 0) {
    return null; // Don't show anything if there's no route data
  }

  const splitDistanceUnit = splits[0]?.distanceUnit || distanceUnit;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pace Breakdown</Text>

      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <View style={styles.splitColumn}>
              <Text style={styles.headerText}>Split</Text>
            </View>
            <View style={styles.timeColumn}>
              <Text style={styles.headerText}>Time</Text>
            </View>
            <View style={styles.paceColumn}>
              <Text style={styles.headerText}>Pace</Text>
            </View>
          </View>

          {splits.map((split, index) => {
            // Find fastest and slowest splits for highlighting
            const paces = splits.map((s) => s.pace);
            const fastestPace = Math.min(...paces);
            const slowestPace = Math.max(...paces);
            const isFastest = split.pace === fastestPace;
            const isSlowest = split.pace === slowestPace && splits.length > 1;

            return (
              <View
                key={index}
                style={[
                  styles.splitRow,
                  index === splits.length - 1 && { borderBottomWidth: 0 },
                  isFastest && styles.fastestRow,
                  isSlowest && styles.slowestRow,
                ]}
              >
                <View style={styles.splitColumn}>
                  <Text style={styles.splitNumber}>{split.splitNumber}</Text>
                </View>

                <View style={styles.timeColumn}>
                  <Text style={[styles.splitValue, isFastest && styles.fastestText]}>
                    {formatSplitTime(split.duration)}
                  </Text>
                </View>

                <View style={styles.paceColumn}>
                  <Text
                    style={[
                      styles.splitValue,
                      isFastest && styles.fastestText,
                      isSlowest && styles.slowestText,
                    ]}
                  >
                    {formatSplitPace(split.pace, splitDistanceUnit)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {splits.length > 1 && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.tertiary }]} />
            <Text style={styles.legendText}>Fastest</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ff1744' }]} />
            <Text style={styles.legendText}>Slowest</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 13,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollView: {
    marginHorizontal: -16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    minWidth: 300,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  splitRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
    alignItems: 'center',
  },
  fastestRow: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  slowestRow: {
    backgroundColor: 'rgba(255, 23, 68, 0.1)',
  },
  splitColumn: {
    width: 60,
    justifyContent: 'center',
  },
  timeColumn: {
    width: 100,
    justifyContent: 'center',
  },
  paceColumn: {
    width: 120,
    justifyContent: 'center',
  },
  headerText: {
    ...uppercase,
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    paddingVertical: 12,
  },
  splitNumber: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  splitValue: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
  fastestText: {
    color: colors.tertiary,
    fontFamily: LatoFonts.bold,
  },
  slowestText: {
    color: '#ff1744',
    fontFamily: LatoFonts.bold,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
});
