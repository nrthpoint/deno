import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { AchievementBadge } from '@/components/StatCard/AchievementBadge';
import { useWorkout } from '@/context/WorkoutContext';

export default function WorkoutDetailScreen() {
  const { selectedWorkout } = useWorkout();

  // Handle case where no workout is selected
  if (!selectedWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout selected</Text>
      </View>
    );
  }

  const workout = selectedWorkout;

  // Simple formatting functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        category: 'Basic Stats',
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
            label: 'Active Energy Burned',
            value: `${Math.round((workout as any).activeEnergyBurned?.quantity || 0)} ${(workout as any).activeEnergyBurned?.unit || 'kcal'}`,
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
            value: `${Math.round(workout.totalElevationAscended?.quantity || 0)} ${workout.totalElevationAscended?.unit || 'm'}`,
          },
          {
            label: 'Humidity',
            value: `${Math.round(workout.humidity?.quantity || 0)}${workout.humidity?.unit || '%'}`,
          },
          {
            label: 'Weather Temperature',
            value: workout.metadata?.HKWeatherTemperature
              ? `${Math.round(Number(workout.metadata.HKWeatherTemperature))}°C`
              : 'N/A',
          },
          {
            label: 'Weather Humidity',
            value: workout.metadata?.HKWeatherHumidity
              ? `${Math.round(Number(workout.metadata.HKWeatherHumidity) * 100)}%`
              : 'N/A',
          },
        ],
      },
    ];

    return stats.map((section, sectionIndex) => (
      <View key={sectionIndex} style={styles.statsSection}>
        <Text style={styles.sectionTitle}>{section.category}</Text>
        <View style={styles.statsTable}>
          {section.items.map((item, index) => (
            <View key={index} style={styles.statsRow}>
              <Text style={styles.statsLabel}>{item.label}</Text>
              <Text style={styles.statsValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    ));
  };

  const renderAchievements = () => {
    const achievements = [];
    if (workout.achievements.isAllTimeFastest) {
      achievements.push({ label: 'All-Time Fastest', color: colors.accent });
    }
    if (workout.achievements.isAllTimeLongest) {
      achievements.push({ label: 'All-Time Longest', color: colors.primary });
    }
    if (workout.achievements.isAllTimeFurthest) {
      achievements.push({ label: 'All-Time Furthest', color: colors.secondary });
    }
    if (workout.achievements.isAllTimeHighestElevation) {
      achievements.push({ label: 'Highest Elevation', color: colors.gray });
    }
    if (workout.achievements.isPersonalBestPace) {
      achievements.push({ label: 'Personal Best Pace', color: colors.accent });
    }

    if (achievements.length === 0) return null;

    return (
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsContainer}>
          {achievements.map((achievement, index) => (
            <AchievementBadge key={index} achievement={achievement} />
          ))}
        </View>
      </View>
    );
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color={colors.neutral} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header with main stats */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="fitness" size={48} color={colors.accent} />
            <View style={styles.headerText}>
              <Text style={styles.workoutType}>{(workout as any).activityType || 'Workout'}</Text>
              <Text style={styles.workoutDate}>{workout.daysAgo}</Text>
            </View>
          </View>
        </View>

        {/* Key metrics */}
        <View style={styles.keyMetrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDistanceValue(workout.totalDistance)}</Text>
            <Text style={styles.metricLabel}>Distance</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDurationValue(workout.duration)}</Text>
            <Text style={styles.metricLabel}>Duration</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{workout.prettyPace}</Text>
            <Text style={styles.metricLabel}>Avg Pace</Text>
          </View>
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
  header: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.gray,
    marginTop: 4,
  },
  keyMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementBadge: {
    marginBottom: 8,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsTable: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.gray,
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
