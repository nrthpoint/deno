import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { DeleteWorkoutWithModal } from '@/components/DeleteWorkout/DeleteWorkoutWithModal';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { AchievementListBadge } from '@/components/StatCard/AchievementListBadge';
import { WorkoutKeyMetrics } from '@/components/WorkoutKeyMetrics/WorkoutKeyMetrics';
import { WorkoutSplits } from '@/components/WorkoutSplits/WorkoutSplits';
import { WorkoutStatsTable } from '@/components/WorkoutStatsTable/WorkoutStatsTable';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useSettings } from '@/context/SettingsContext';
import { useWorkout } from '@/context/Workout';
import { formatPace } from '@/utils/pace';
import { subheading } from '@/utils/text';
import { formatDuration, formatTime, formatWorkoutDate } from '@/utils/time';

export default function ViewWorkoutScreen() {
  const posthog = usePostHog();
  const { selectedWorkouts } = useWorkout();
  const { distanceUnit } = useSettings();

  const selectedWorkout = selectedWorkouts[0];

  useEffect(() => {
    if (selectedWorkout) {
      posthog?.capture(ANALYTICS_EVENTS.WORKOUT_VIEWED, {
        $screen_name: 'view_workout',
        workout_uuid: selectedWorkout.uuid,
        distance_quantity: selectedWorkout.distance.quantity,
        distance_unit: selectedWorkout.distance.unit,
        duration: selectedWorkout.duration,
        has_achievements: Object.values(selectedWorkout.achievements).some((a) => a === true),
      });
    }
  }, [selectedWorkout, posthog]);

  if (!selectedWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout selected</Text>
      </View>
    );
  }

  const renderAchievements = () => {
    const achievements = [];

    if (selectedWorkout.achievements.isAllTimeFastest) {
      achievements.push({ label: 'All-Time Fastest' });
    }
    if (selectedWorkout.achievements.isAllTimeLongest) {
      achievements.push({ label: 'All-Time Longest' });
    }
    if (selectedWorkout.achievements.isAllTimeFurthest) {
      achievements.push({ label: 'All-Time Furthest' });
    }
    if (selectedWorkout.achievements.isAllTimeHighestElevation) {
      achievements.push({ label: 'Highest Elevation' });
    }

    if (achievements.length === 0) return null;

    return (
      <View style={styles.achievementsSection}>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <AchievementListBadge
              key={index}
              label={achievement.label}
            />
          ))}
        </View>
      </View>
    );
  };

  const paceWithoutUnit = formatPace(selectedWorkout.pace, false);
  const paceUnit = selectedWorkout.pace.unit;
  const formattedWorkoutDate = formatWorkoutDate(selectedWorkout.endDate);
  const formattedDuration = formatDuration(selectedWorkout.duration);
  const formattedStartTime = formatTime(selectedWorkout.startDate);

  const handleMapPress = () => {
    router.push('/map-detail');
  };

  const handleDelete = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Workout Details',
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: {
            color: colors.neutral,
            fontFamily: LatoFonts.bold,
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.neutral}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <DeleteWorkoutWithModal
              workout={selectedWorkout}
              onDelete={handleDelete}
              iconSize={24}
            />
          ),
        }}
      />

      <ScrollView style={styles.container}>
        {/* Header with main stats */}
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.workoutType}>{formattedWorkoutDate}</Text>
            <Text style={styles.workoutDate}>
              {formattedStartTime} - {selectedWorkout.daysAgo}
            </Text>
          </View>
        </View>

        <RouteMap
          samples={[selectedWorkout]}
          previewMode={true}
          onPress={handleMapPress}
          maxPoints={40}
          style={{ height: 200 }}
        />

        <View style={styles.containerContent}>
          {renderAchievements()}

          <WorkoutKeyMetrics
            distance={selectedWorkout.distance.formatted}
            duration={formattedDuration}
            pace={paceWithoutUnit}
            paceUnit={paceUnit}
          />

          <WorkoutStatsTable workout={selectedWorkout} />

          <WorkoutSplits
            workout={selectedWorkout}
            distanceUnit={distanceUnit}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerContent: {
    padding: 16,
    gap: 10,
  },
  backButton: {
    marginLeft: 8,
    padding: 8,
  },
  headerContent: {
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  workoutType: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'capitalize',
  },
  workoutDate: {
    ...subheading,
    color: colors.lightGray,
    marginTop: 10,
    marginBottom: 0,
  },
  achievementsSection: {
    marginTop: 30,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
});
