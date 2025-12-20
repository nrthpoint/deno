import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts, OrelegaOneFonts } from '@/config/fonts';
import { SCREEN_NAMES } from '@/constants/analytics';
import { useWorkout } from '@/context/Workout';
import { usePageView } from '@/hooks/usePageView';

export default function NoWorkoutsScreen() {
  usePageView({ screenName: SCREEN_NAMES.NO_WORKOUTS });
  const { workouts } = useWorkout();

  if (workouts.samples.length > 0) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="fitness-outline"
          size={64}
          color={colors.lightGray}
        />
      </View>

      <Text style={styles.title}>No Workouts Found</Text>

      <Text style={styles.subtitle}>
        The app needs workouts to continue. You can add your own workouts or grant HealthKit
        permissions to import existing data.
      </Text>

      <Button
        mode="contained"
        onPress={() => router.push('/add-workout')}
        style={styles.addButton}
        labelStyle={styles.buttonLabel}
        icon={() => (
          <Ionicons
            name="add"
            size={20}
            color={colors.neutral}
          />
        )}
      >
        Add Workout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: colors.background,
  },
  iconContainer: {
    marginBottom: 32,
    opacity: 0.6,
  },
  title: {
    fontSize: 28,
    fontFamily: OrelegaOneFonts.regular,
    color: colors.neutral,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  buttonLabel: {
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
