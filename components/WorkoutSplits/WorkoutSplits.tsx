import { Ionicons } from '@expo/vector-icons';
import { LengthUnit } from '@kingstinct/react-native-healthkit';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
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
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={['#6291FF', '#4F75E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="speedometer-outline"
                size={20}
                color={colors.neutral}
              />
            </View>
            <Text style={styles.title}>Pace Breakdown</Text>
          </View>

          {splits.length > 1 && (
            <View style={styles.headerLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.fastestDot]} />
                <Text style={styles.legendText}>Fastest</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.slowestDot]} />
                <Text style={styles.legendText}>Slowest</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.tableContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  headerContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 13,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  headerLegend: {
    flexDirection: 'row',
    gap: 16,
  },
  tableContainer: {
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceHighlight,
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
    alignItems: 'center',
  },
  timeColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paceColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    ...uppercase,
    color: colors.lightGray,
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    paddingVertical: 12,
    textAlign: 'center',
  },
  splitNumber: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
  },
  splitValue: {
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
  fastestText: {
    color: colors.tertiary,
    fontFamily: LatoFonts.bold,
  },
  slowestText: {
    color: '#ff1744',
    fontFamily: LatoFonts.bold,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 7,
    borderColor: colors.background,
  },
  fastestDot: {
    backgroundColor: colors.tertiary,
  },
  slowestDot: {
    backgroundColor: '#ff1744',
  },
  legendText: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontFamily: LatoFonts.bold,
    color: colors.background,
  },
});
