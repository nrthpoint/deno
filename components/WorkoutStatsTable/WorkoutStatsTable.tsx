import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface WorkoutStatsTableProps {
  workout: ExtendedWorkout;
}

/**
 * WorkoutStatsTable Component
 *
 * Displays detailed workout statistics including elevation gain, average METs,
 * temperature, humidity, and indoor/outdoor status.
 *
 * Used in:
 * - app/view-workout.tsx - Shows additional workout metrics below the key metrics card
 */
export const WorkoutStatsTable: React.FC<WorkoutStatsTableProps> = ({ workout }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="stats-chart"
                size={20}
                color={colors.neutral}
              />
            </View>
            <Text style={styles.sectionTitle}>Workout Stats</Text>
          </View>
        </View>

        <View style={styles.statsTable}>
          <View style={styles.statsRow}>
            <View style={styles.statsLabelContainer}>
              <Ionicons
                name="trending-up"
                size={16}
                color={colors.lightGray}
              />
              <Text style={styles.statsLabel}>Elevation Gain</Text>
            </View>
            <Text style={styles.statsValue}>
              {Math.round(workout.elevation?.quantity || 0)} {workout.elevation?.unit || 'm'}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsLabelContainer}>
              <Ionicons
                name="flash"
                size={16}
                color={colors.lightGray}
              />
              <Text style={styles.statsLabel}>Average METs</Text>
            </View>
            <Text style={styles.statsValue}>
              {workout.averageMETs?.quantity
                ? `${workout.averageMETs.quantity.toFixed(1)} ${workout.averageMETs.unit}`
                : 'N/A'}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsLabelContainer}>
              <Ionicons
                name="thermometer"
                size={16}
                color={colors.lightGray}
              />
              <Text style={styles.statsLabel}>Temperature</Text>
            </View>
            <Text style={styles.statsValue}>
              {workout.temperature ? workout.temperature.formatted : 'N/A'}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statsLabelContainer}>
              <Ionicons
                name="water"
                size={16}
                color={colors.lightGray}
              />
              <Text style={styles.statsLabel}>Humidity</Text>
            </View>
            <Text style={styles.statsValue}>
              {workout.humidity ? workout.humidity.formatted : 'N/A'}
            </Text>
          </View>

          <View style={[styles.statsRow, styles.statsRowLast]}>
            <View style={styles.statsLabelContainer}>
              <Ionicons
                name="home"
                size={16}
                color={colors.lightGray}
              />
              <Text style={styles.statsLabel}>Indoor</Text>
            </View>
            <Text style={styles.statsValue}>
              {workout.metadata?.HKIndoorWorkout === 'true' ? 'Yes' : 'No'}
            </Text>
          </View>
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
    marginTop: 8,
  },
  statsContainer: {
    overflow: 'hidden',
  },
  sectionHeaderContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.accent,
  },
  iconCircle: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: LatoFonts.bold,
    //color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statsTable: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statsRowLast: {
    borderBottomWidth: 0,
  },
  statsLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statsValue: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'right',
  },
});
