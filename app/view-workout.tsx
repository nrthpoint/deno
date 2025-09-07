import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { AchievementListBadge } from '@/components/StatCard/AchievementListBadge';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/WorkoutContext';
import { subheading } from '@/utils/text';
import { formatDate, formatPace, formatTime, formatWorkoutDate } from '@/utils/time';

export default function ViewWorkoutScreen() {
  const { selectedWorkout, setSelectedWorkouts } = useWorkout();

  if (!selectedWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout selected</Text>
      </View>
    );
  }

  const workout = selectedWorkout;

  const formatDurationValue = (duration: any) => {
    if (!duration?.quantity) return '0s';

    const seconds = Math.round(duration.quantity);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatDistanceValue = (distance: any) => {
    if (!distance?.quantity) return '0';
    return `${distance.quantity.toFixed(2)} ${distance.unit}`;
  };

  const renderStatsTable = () => {
    const stats = [
      {
        category: 'Workout Info',
        items: [
          { label: 'Date', value: formatDate(new Date(workout.startDate)) },
          { label: 'Start Time', value: formatTime(new Date(workout.startDate)) },
          { label: 'Duration', value: formatDurationValue(workout.duration) },
          { label: 'Distance', value: formatDistanceValue(workout.totalDistance) },
          { label: 'Average Pace', value: workout.prettyPace },
        ],
      },
      {
        category: 'Performance',
        items: [
          {
            label: 'Total Energy Burned',
            value: `${Math.round(workout.totalEnergyBurned?.quantity || 0)} ${workout.totalEnergyBurned?.unit || 'kcal'}`,
          },
          {
            label: 'Average Heart Rate',
            value: workout.metadata?.HKAverageHeartRate
              ? `${Math.round(Number(workout.metadata.HKAverageHeartRate))} bpm`
              : 'N/A',
          },
          {
            label: 'Max Heart Rate',
            value: workout.metadata?.HKMaximumHeartRate
              ? `${Math.round(Number(workout.metadata.HKMaximumHeartRate))} bpm`
              : 'N/A',
          },
        ],
      },
      {
        category: 'Environmental',
        items: [
          {
            label: 'Elevation Gain',
            value: `${Math.round(workout.totalElevation?.quantity || 0)} ${workout.totalElevation?.unit || 'm'}`,
          },
          {
            label: 'Humidity',
            value: `${Math.round(workout.humidity?.quantity || 0)}${workout.humidity?.unit || '%'}`,
          },
          {
            label: 'Temperature',
            value: workout.metadata?.HKWeatherTemperature
              ? `${Math.round(Number(workout.metadata.HKWeatherTemperature))}°C`
              : 'N/A',
          },
          {
            label: 'Humidity',
            value: workout.metadata?.HKWeatherHumidity
              ? `${Math.round(Number(workout.metadata.HKWeatherHumidity) * 100)}%`
              : 'N/A',
          },
        ],
      },
    ];

    return stats.map((section, sectionIndex) => (
      <Card key={sectionIndex}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>{section.category}</Text>
          <View style={styles.statsTable}>
            {section.items.map((item, index) => (
              <View
                key={index}
                style={styles.statsRow}
              >
                <Text style={styles.statsLabel}>{item.label}</Text>
                <Text style={styles.statsValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card>
    ));
  };

  const renderAchievements = () => {
    const achievements = [];

    if (workout.achievements.isAllTimeFastest) {
      achievements.push({ label: 'All-Time Fastest' });
    }
    if (workout.achievements.isAllTimeLongest) {
      achievements.push({ label: 'All-Time Longest' });
    }
    if (workout.achievements.isAllTimeFurthest) {
      achievements.push({ label: 'All-Time Furthest' });
    }
    if (workout.achievements.isAllTimeHighestElevation) {
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

  const paceWithoutUnit = formatPace(workout.averagePace, false);
  const paceUnit = workout.averagePace.unit || 'min/mi';
  const formattedWorkoutDate = formatWorkoutDate(workout.endDate);

  const handleMapPress = () => {
    setSelectedWorkouts([workout]);
    router.push('/map-detail');
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
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with main stats */}
        <Card>
          <View style={[styles.headerContent, { backgroundColor: colors.primary }]}>
            <Ionicons
              name="fitness"
              size={48}
              color={colors.neutral}
            />
            <View style={styles.headerText}>
              <Text style={styles.workoutType}>{formattedWorkoutDate}</Text>
              <Text style={styles.workoutDate}>{workout.daysAgo}</Text>
            </View>
          </View>
        </Card>

        <View>
          <RouteMap
            samples={[workout]}
            previewMode={true}
            onPress={handleMapPress}
            maxPoints={40}
          />
        </View>

        {/* Key metrics */}
        <View style={styles.keyMetrics}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDistanceValue(workout.totalDistance)}</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDurationValue(workout.duration)}</Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </Card>
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{paceWithoutUnit}</Text>
            <Text style={styles.metricLabel}>{paceUnit}</Text>
          </Card>
        </View>

        {/* Achievements */}
        {renderAchievements()}

        {/* Detailed stats */}
        {renderStatsTable()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  backButton: {
    marginLeft: 8,
    padding: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 16,
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  workoutType: {
    fontSize: 24,
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
  keyMetrics: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 10,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.lightGray,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  statsContainer: {
    margin: 10,
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginTop: 10,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  statsTable: {
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    flex: 1,
  },
  statsValue: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
});
