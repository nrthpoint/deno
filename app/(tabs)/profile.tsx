import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProfileStatCard } from '@/components/ProfileStatCard/ProfileStatCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { SCREEN_NAMES } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';
import { useWorkout } from '@/context/Workout';
import { useWorkoutAnalytics, WorkoutAnalytics } from '@/context/WorkoutAnalytics';
import { usePageView } from '@/hooks/usePageView';

export default function ProfileScreen() {
  const { distanceUnit } = useSettings();
  const { getWorkoutAnalytics, isLoading: isStatsLoading } = useWorkoutAnalytics();
  const { workouts, setSelectedWorkouts, query } = useWorkout();

  const [cachedStats, setCachedStats] = useState<WorkoutAnalytics | null>(null);

  const { samples, loading: isWorkoutsLoading } = workouts;

  usePageView({ screenName: SCREEN_NAMES.PROFILE });

  useEffect(() => {
    const loadProfileStats = async () => {
      if (!isWorkoutsLoading && samples.length > 0) {
        try {
          const stats = await getWorkoutAnalytics(samples, query);
          setCachedStats(stats);
        } catch (error) {
          console.error('Error calculating profile stats:', error);
        }
      } else if (!workouts) {
        setCachedStats(null);
      }
    };

    loadProfileStats();
  }, [getWorkoutAnalytics, isWorkoutsLoading, query, samples, workouts]);

  const handleStatPress = (workout: any) => {
    if (workout) {
      setSelectedWorkouts([workout]);
      router.push('/view-workout');
    }
  };

  const isLoading = isWorkoutsLoading || isStatsLoading(query);

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
});
