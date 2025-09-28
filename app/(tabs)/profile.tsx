import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProfileStatCard } from '@/components/ProfileStatCard/ProfileStatCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutAnalytics, WorkoutAnalytics } from '@/context/WorkoutAnalytics';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useWorkoutSelection } from '@/hooks/useWorkoutSelectors';

export default function ProfileScreen() {
  const { distanceUnit, activityType, timeRangeInDays } = useSettings();
  const { setSelectedWorkout } = useWorkoutSelection();
  const { getWorkoutAnalytics, isLoading: isStatsLoading } = useWorkoutAnalytics();
  const [cachedStats, setCachedStats] = useState<WorkoutAnalytics | null>(null);

  const query = useMemo(
    () => ({
      activityType,
      distanceUnit,
      timeRangeInDays,
    }),
    [activityType, distanceUnit, timeRangeInDays],
  );
  const { samples: workouts, loading: workoutsLoading } = useWorkoutData(query);

  useEffect(() => {
    const loadProfileStats = async () => {
      if (!workoutsLoading && workouts.length > 0) {
        try {
          const stats = await getWorkoutAnalytics(workouts, query);
          setCachedStats(stats);
        } catch (error) {
          console.error('Error calculating profile stats:', error);
        }
      } else if (!workoutsLoading) {
        setCachedStats(null);
      }
    };

    loadProfileStats();
  }, [workouts, workoutsLoading, getWorkoutAnalytics, query]);

  const handleStatPress = (workout: any) => {
    if (workout) {
      setSelectedWorkout(workout);
      router.push('/view-workout');
    }
  };

  const isLoading = workoutsLoading || isStatsLoading(query);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Your running achievements</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
            <Text style={styles.loadingText}>Loading your stats...</Text>
          </View>
        ) : cachedStats ? (
          <>
            <ProfileStatCard
              icon="flash"
              title="Fastest Workout"
              value={cachedStats.profileStats.fastestWorkout.pace}
              subtitle={cachedStats.profileStats.fastestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(cachedStats.profileStats.fastestWorkout.workout)}
              color="#00e676"
            />

            <ProfileStatCard
              icon="time"
              title="Longest Workout"
              value={cachedStats.profileStats.longestWorkout.duration}
              subtitle={cachedStats.profileStats.longestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(cachedStats.profileStats.longestWorkout.workout)}
              color="#ff9800"
            />

            <ProfileStatCard
              icon="trending-up"
              title="Highest Elevation"
              value={cachedStats.profileStats.highestElevationWorkout.elevation}
              subtitle={
                cachedStats.profileStats.highestElevationWorkout.workout?.daysAgo || 'No data'
              }
              onPress={() =>
                handleStatPress(cachedStats.profileStats.highestElevationWorkout.workout)
              }
              color="#6cea12ff"
            />

            <ProfileStatCard
              icon="speedometer"
              title="Fastest Split"
              value={cachedStats.profileStats.fastestSplit.splitTime}
              subtitle={
                cachedStats.profileStats.fastestSplit.splitNumber > 0
                  ? `Split ${cachedStats.profileStats.fastestSplit.splitNumber} (${distanceUnit})`
                  : 'No split data'
              }
              onPress={() => handleStatPress(cachedStats.profileStats.fastestSplit.workout)}
              color="#e91e63"
            />

            <ProfileStatCard
              icon="hourglass"
              title="Shortest Workout"
              value={cachedStats.profileStats.shortestWorkout.duration}
              subtitle={cachedStats.profileStats.shortestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(cachedStats.profileStats.shortestWorkout.workout)}
              color="#2196f3"
            />

            <Text style={styles.trendsTitle}>Weekly Trends</Text>

            <ProfileStatCard
              icon="calendar"
              title="Fastest Day"
              value={cachedStats.weeklyTrends.fastestDay.dayName}
              subtitle={`${cachedStats.weeklyTrends.fastestDay.count} runs`}
              onPress={() => {}}
              color="#00e676"
            />

            <ProfileStatCard
              icon="calendar"
              title="Longest Day"
              value={cachedStats.weeklyTrends.longestDay.dayName}
              subtitle={`${cachedStats.weeklyTrends.longestDay.count} runs`}
              onPress={() => {}}
              color="#ff9800"
            />

            <ProfileStatCard
              icon="calendar"
              title="Highest Elevation Day"
              value={cachedStats.weeklyTrends.highestElevationDay.dayName}
              subtitle={`${cachedStats.weeklyTrends.highestElevationDay.count} runs`}
              onPress={() => {}}
              color="#6cea12ff"
            />
          </>
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons
              name="fitness"
              size={64}
              color={colors.lightGray}
            />
            <Text style={styles.noDataText}>No workout data available</Text>
            <Text style={styles.noDataSubtext}>Start running to see your stats!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.neutral,
    fontSize: 40,
    fontFamily: 'OrelegaOne',
    textAlign: 'left',
  },
  headerSubtitle: {
    color: colors.lightGray,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  noDataText: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.lightGray,
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginTop: 8,
    textAlign: 'center',
  },
  trendsTitle: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'left',
  },
});
