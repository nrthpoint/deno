import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { DeleteWorkout } from '@/components/DeleteWorkout/DeleteWorkout';
import { RouteMap } from '@/components/RouteMap/RouteMap';
import { AchievementListBadge } from '@/components/StatCard/AchievementListBadge';
import { WeatherSummary } from '@/components/WeatherSummary/WeatherSummary';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkoutSelection } from '@/hooks/useWorkoutSelectors';
import { formatDistance } from '@/utils/distance';
import { subheading } from '@/utils/text';
import {
  formatDate,
  formatDuration,
  formatPace,
  formatTime,
  formatWorkoutDate,
} from '@/utils/time';

export default function ViewWorkoutScreen() {
  const { selectedWorkout, setSelectedWorkouts } = useWorkoutSelection();

  if (!selectedWorkout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No workout selected</Text>
      </View>
    );
  }

  const renderStatsTable = () => {
    const stats = [
      {
        category: 'Workout Info',
        icon: 'information-circle' as keyof typeof Ionicons.glyphMap,
        items: [
          {
            label: 'Date',
            value: formatDate(new Date(selectedWorkout.startDate)),
            icon: 'calendar' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Start Time',
            value: formatTime(new Date(selectedWorkout.startDate)),
            icon: 'time' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Duration',
            value: formatDuration(selectedWorkout.duration),
            icon: 'stopwatch' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Distance',
            value: formatDistance(selectedWorkout.totalDistance),
            icon: 'map' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Average Pace',
            value: selectedWorkout.prettyPace,
            icon: 'speedometer' as keyof typeof Ionicons.glyphMap,
          },
        ],
      },
      {
        category: 'Performance',
        icon: 'trending-up' as keyof typeof Ionicons.glyphMap,
        items: [
          {
            label: 'Total Energy Burned',
            value: `${Math.round(selectedWorkout.totalEnergyBurned?.quantity || 0)} ${selectedWorkout.totalEnergyBurned?.unit || 'kcal'}`,
            icon: 'flame' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Average Heart Rate',
            value: selectedWorkout.metadata?.HKAverageHeartRate
              ? `${Math.round(Number(selectedWorkout.metadata.HKAverageHeartRate))} bpm`
              : 'N/A',
            icon: 'heart' as keyof typeof Ionicons.glyphMap,
          },
          {
            label: 'Max Heart Rate',
            value: selectedWorkout.metadata?.HKMaximumHeartRate
              ? `${Math.round(Number(selectedWorkout.metadata.HKMaximumHeartRate))} bpm`
              : 'N/A',
            icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
          },
        ],
      },
      {
        category: 'Environmental',
        icon: 'earth' as keyof typeof Ionicons.glyphMap,
        items: [
          {
            label: 'Elevation Gain',
            value: `${Math.round(selectedWorkout.totalElevation?.quantity || 0)} ${selectedWorkout.totalElevation?.unit || 'm'}`,
            icon: 'trending-up' as keyof typeof Ionicons.glyphMap,
          },
        ],
      },
    ];

    return stats.map((section, sectionIndex) => (
      <Card key={sectionIndex}>
        <View style={styles.statsContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name={section.icon}
              size={20}
              color={colors.neutral}
            />
            <Text style={styles.sectionTitle}>{section.category}</Text>
          </View>

          <View style={styles.statsTable}>
            {section.items.map((item, index) => (
              <View
                key={index}
                style={[styles.statsRow, index === section.items.length - 1 && styles.statsRowLast]}
              >
                <View style={styles.statsLabelContainer}>
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={colors.lightGray}
                  />
                  <Text style={styles.statsLabel}>{item.label}</Text>
                </View>
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

  const paceWithoutUnit = formatPace(selectedWorkout.averagePace, false);
  const paceUnit = selectedWorkout.averagePace.unit || 'min/mi';
  const formattedWorkoutDate = formatWorkoutDate(selectedWorkout.endDate);

  const handleMapPress = () => {
    setSelectedWorkouts([selectedWorkout]);
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
            <DeleteWorkout
              workout={selectedWorkout}
              onDelete={handleDelete}
              iconSize={24}
            />
          ),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with main stats */}
        <Card>
          <View style={[styles.headerContent]}>
            {/* <Ionicons
              name="fitness"
              size={48}
              color={colors.neutral}
            /> */}
            <View style={styles.headerText}>
              <Text style={styles.workoutType}>{formattedWorkoutDate}</Text>
              <Text style={styles.workoutDate}>{selectedWorkout.daysAgo}</Text>
            </View>
          </View>
        </Card>

        <View>
          <RouteMap
            samples={[selectedWorkout]}
            previewMode={true}
            onPress={handleMapPress}
            maxPoints={40}
          />
        </View>

        {renderAchievements()}

        {/* Key metrics */}
        <View style={styles.keyMetrics}>
          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDistance(selectedWorkout.totalDistance)}</Text>

            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>Distance</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{formatDuration(selectedWorkout.duration)}</Text>

            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>Duration</Text>
            </View>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={styles.metricValue}>{paceWithoutUnit}</Text>

            <View style={styles.metricLabelContainer}>
              <Text style={styles.metricLabel}>{paceUnit}</Text>
            </View>
          </Card>
        </View>

        {renderStatsTable()}

        <WeatherSummary workout={selectedWorkout} />
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
    //marginLeft: 16,
    flex: 1,
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
  keyMetrics: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 10,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
    textAlign: 'center',
    padding: 16,
  },
  metricLabelContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  achievementsSection: {
    marginTop: 30,
    //marginBottom: 24,
  },
  statsContainer: {},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 16,
    backgroundColor: colors.surfaceHighlight,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  achievementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  statsTable: {
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  statsRowLast: {
    borderBottomWidth: 0,
  },
  statsLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
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
