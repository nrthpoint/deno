import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { RouteMap } from '@/components/RouteMap/RouteMap';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/Workout';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export default function MapDetailScreen() {
  const { selectedWorkout, selectedWorkouts } = useWorkout();
  const params = useLocalSearchParams();

  // Determine which workouts to show
  let workoutsToShow = [] as ExtendedWorkout[];

  if (params.mode === 'comparison' && selectedWorkouts.length > 0) {
    workoutsToShow = selectedWorkouts;
  } else if (selectedWorkout) {
    workoutsToShow = [selectedWorkout];
  }

  if (workoutsToShow.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout data available</Text>
      </View>
    );
  }

  const getTitle = () => {
    if (params.mode === 'comparison') {
      return 'Route Comparison';
    }

    return 'Route Details';
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: getTitle(),
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
        }}
      />

      <View style={styles.container}>
        <RouteMap
          samples={workoutsToShow}
          previewMode={false}
          maxPoints={100}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    marginLeft: 8,
    padding: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
    marginTop: 50,
  },
});
