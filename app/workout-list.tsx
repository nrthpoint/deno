import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { DeleteWorkoutWithModal } from '@/components/DeleteWorkout/DeleteWorkoutWithModal';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { SCREEN_NAMES } from '@/constants/analytics';
import { useWorkout } from '@/context/Workout';
import { usePageView } from '@/hooks/usePageView';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatDistance } from '@/utils/distance';
import { formatDuration, formatWorkoutDate } from '@/utils/time';

export default function WorkoutListScreen() {
  usePageView({ screenName: SCREEN_NAMES.WORKOUT_LIST });
  const { selectedWorkouts, setSelectedWorkouts } = useWorkout();

  const handleWorkoutPress = (workout: ExtendedWorkout) => {
    setSelectedWorkouts([workout]);
    router.push('/view-workout');
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={colors.neutral}
            />
          </Pressable>
          <Text style={styles.headerTitle}>All {selectedWorkouts.length} Workouts</Text>
        </View>
        {selectedWorkouts.map((workout, index) => (
          <View
            key={workout.uuid}
            style={[styles.workoutItem, index % 2 === 0 && styles.alternateRow]}
          >
            <Pressable
              style={styles.workoutRow}
              onPress={() => handleWorkoutPress(workout)}
            >
              <View style={styles.dateColumn}>
                <Text
                  style={styles.dateText}
                  numberOfLines={1}
                >
                  {formatWorkoutDate(workout.startDate)}
                </Text>
              </View>
              <View style={styles.distanceColumn}>
                <Text
                  style={styles.distanceText}
                  numberOfLines={1}
                >
                  {formatDistance(workout.distance)}
                </Text>
              </View>
              <View style={styles.timeColumn}>
                <Text
                  style={styles.timeText}
                  numberOfLines={1}
                >
                  {formatDuration(workout.duration)}
                </Text>
              </View>
            </Pressable>

            <View style={styles.deleteColumn}>
              <DeleteWorkoutWithModal
                workout={workout}
                iconSize={18}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  backButton: {
    padding: 4,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 2,
  },
  alternateRow: {
    backgroundColor: colors.surface,
  },
  workoutRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateColumn: {
    flex: 2,
  },
  distanceColumn: {
    flex: 1.5,
    alignItems: 'center',
  },
  timeColumn: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  deleteColumn: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
  timeText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
  },
});
