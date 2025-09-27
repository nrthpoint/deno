import { Ionicons } from '@expo/vector-icons';
import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ProfileStatCard } from '@/components/ProfileStatCard/ProfileStatCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useWorkoutSelection } from '@/hooks/useWorkoutSelectors';
import { calculateProfileStats, ProfileStats } from '@/utils/profileStats';

export default function ProfileScreen() {
  const { distanceUnit } = useSettings();
  const { setSelectedWorkout } = useWorkoutSelection();
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Get all workout data for the past year
  const { samples: workouts, loading: workoutsLoading } = useWorkoutData({
    activityType: WorkoutActivityType.running,
    distanceUnit: distanceUnit,
    timeRangeInDays: 365,
  });

  useEffect(() => {
    const loadProfileStats = async () => {
      if (!workoutsLoading && workouts.length > 0) {
        setStatsLoading(true);
        try {
          const stats = await calculateProfileStats(workouts, distanceUnit);
          setProfileStats(stats);
        } catch (error) {
          console.error('Error calculating profile stats:', error);
        } finally {
          setStatsLoading(false);
        }
      } else if (!workoutsLoading) {
        setStatsLoading(false);
      }
    };

    loadProfileStats();
  }, [workouts, workoutsLoading, distanceUnit]);

  const handleStatPress = (workout: any) => {
    if (workout) {
      setSelectedWorkout(workout);
      router.push('/view-workout');
    }
  };

  const isLoading = workoutsLoading || statsLoading;

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
        ) : profileStats ? (
          <>
            <ProfileStatCard
              icon="flash"
              title="Fastest Workout"
              value={profileStats.fastestWorkout.pace}
              subtitle={profileStats.fastestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(profileStats.fastestWorkout.workout)}
              color="#00e676"
            />

            <ProfileStatCard
              icon="time"
              title="Longest Workout"
              value={profileStats.longestWorkout.duration}
              subtitle={profileStats.longestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(profileStats.longestWorkout.workout)}
              color="#ff9800"
            />

            <ProfileStatCard
              icon="trending-up"
              title="Highest Elevation"
              value={profileStats.highestElevationWorkout.elevation}
              subtitle={profileStats.highestElevationWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(profileStats.highestElevationWorkout.workout)}
              color="#6cea12ff"
            />

            <ProfileStatCard
              icon="speedometer"
              title="Fastest Split"
              value={profileStats.fastestSplit.splitTime}
              subtitle={
                profileStats.fastestSplit.splitNumber > 0
                  ? `Split ${profileStats.fastestSplit.splitNumber} (${distanceUnit})`
                  : 'No split data'
              }
              onPress={() => handleStatPress(profileStats.fastestSplit.workout)}
              color="#e91e63"
            />

            <ProfileStatCard
              icon="hourglass"
              title="Shortest Workout"
              value={profileStats.shortestWorkout.duration}
              subtitle={profileStats.shortestWorkout.workout?.daysAgo || 'No data'}
              onPress={() => handleStatPress(profileStats.shortestWorkout.workout)}
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
