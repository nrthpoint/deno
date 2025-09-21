import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { forwardRef, useCallback, useMemo, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, ScrollView, View } from 'react-native';
import { Text, Portal } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/WorkoutContext';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { formatDistance } from '@/utils/distance';
import { formatDuration, formatWorkoutDate } from '@/utils/time';

interface WorkoutListBottomSheetProps {
  workouts: ExtendedWorkout[];
  title?: string;
}

export interface WorkoutListBottomSheetRef {
  open: () => void;
  close: () => void;
}

export const WorkoutListBottomSheet = forwardRef<
  WorkoutListBottomSheetRef,
  WorkoutListBottomSheetProps
>(({ workouts, title = 'All Workouts' }, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { setSelectedWorkout } = useWorkout();

  const snapPoints = useMemo(() => ['60%', '90%'], []);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleWorkoutPress = useCallback(
    (workout: ExtendedWorkout) => {
      setSelectedWorkout(workout);
      bottomSheetRef.current?.close();
      router.push('/view-workout');
    },
    [setSelectedWorkout],
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {workouts.map((workout, index) => (
              <Pressable
                key={workout.uuid}
                style={[styles.workoutItem, index % 2 === 0 && styles.alternateRow]}
                onPress={() => handleWorkoutPress(workout)}
              >
                <View style={styles.workoutRow}>
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
                      {formatDistance(workout.totalDistance)}
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
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

WorkoutListBottomSheet.displayName = 'WorkoutListBottomSheet';

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: colors.background,
  },
  handleIndicator: {
    backgroundColor: colors.neutral,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  workoutItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 2,
  },
  alternateRow: {
    backgroundColor: colors.surface,
  },
  workoutRow: {
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
