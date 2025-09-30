import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useWorkout } from '@/context/Workout';
import { useWorkoutAnalytics } from '@/context/WorkoutAnalytics';

export default function WeeklyPatternsScreen() {
  const router = useRouter();

  const { getWeeklyTrends, isLoading: isAnalyticsLoading } = useWorkoutAnalytics();
  const { workouts, query } = useWorkout();

  const [weeklyTrends, setWeeklyTrends] = useState<any>(null);

  const { samples, loading: isWorkoutsLoading } = workouts;

  useEffect(() => {
    const loadWeeklyTrends = async () => {
      if (!isWorkoutsLoading && samples.length > 0) {
        try {
          const trends = await getWeeklyTrends(samples, query);
          setWeeklyTrends(trends);
        } catch (error) {
          console.error('Error calculating weekly trends:', error);
        }
      } else if (!isWorkoutsLoading) {
        setWeeklyTrends(null);
      }
    };

    loadWeeklyTrends();
  }, [getWeeklyTrends, isWorkoutsLoading, query, samples, workouts]);

  const isLoading = isWorkoutsLoading || isAnalyticsLoading(query);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color="#fff"
          />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Weekly Patterns</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            animating
            color="#fff"
            size="large"
          />
          <Text style={styles.loadingText}>Analyzing your weekly patterns...</Text>
        </View>
      ) : weeklyTrends ? (
        <ScrollView style={styles.content}>
          <Text style={styles.subtitle}>Which days of the week do you perform your best runs?</Text>

          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>🏃‍♂️ Fastest Runs</Text>
            <Text style={styles.cardValue}>{weeklyTrends.fastestDay.dayName}</Text>
            <Text style={styles.cardSubtitle}>
              {weeklyTrends.fastestDay.count} runs on this day
            </Text>
          </View>

          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>⏱️ Longest Runs</Text>
            <Text style={styles.cardValue}>{weeklyTrends.longestDay.dayName}</Text>
            <Text style={styles.cardSubtitle}>
              {weeklyTrends.longestDay.count} runs on this day
            </Text>
          </View>

          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>⚡ Shortest Runs</Text>
            <Text style={styles.cardValue}>{weeklyTrends.shortestDay.dayName}</Text>
            <Text style={styles.cardSubtitle}>
              {weeklyTrends.shortestDay.count} runs on this day
            </Text>
          </View>

          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>🏔️ Highest Elevation</Text>
            <Text style={styles.cardValue}>{weeklyTrends.highestElevationDay.dayName}</Text>
            <Text style={styles.cardSubtitle}>
              {weeklyTrends.highestElevationDay.count} runs on this day
            </Text>
          </View>

          <View style={styles.trendCard}>
            <Text style={styles.cardTitle}>🚀 Furthest Runs</Text>
            <Text style={styles.cardValue}>{weeklyTrends.furthestDay.dayName}</Text>
            <Text style={styles.cardSubtitle}>
              {weeklyTrends.furthestDay.count} runs on this day
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Weekly Distribution</Text>
          {weeklyTrends.dayDistribution.map((day: any, index: number) => (
            <View
              key={index}
              style={styles.distributionItem}
            >
              <Text style={styles.dayName}>{day.dayName}</Text>
              <View style={styles.distributionBar}>
                <View style={[styles.distributionFill, { width: `${day.percentage}%` }]} />
              </View>
              <Text style={styles.percentage}>
                {day.count} runs ({day.percentage.toFixed(1)}%)
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <Ionicons
            name="calendar"
            size={64}
            color={colors.lightGray}
          />
          <Text style={styles.noDataText}>No workout data available</Text>
          <Text style={styles.noDataSubtext}>Start running to see your weekly patterns!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
    marginLeft: -50,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    color: colors.neutral,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  trendCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardTitle: {
    color: colors.lightGray,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginBottom: 8,
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.lightGray,
    fontSize: 12,
    fontFamily: LatoFonts.regular,
  },
  sectionTitle: {
    color: colors.neutral,
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    marginTop: 32,
    marginBottom: 16,
  },
  distributionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    color: colors.neutral,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    width: 80,
  },
  distributionBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginHorizontal: 12,
  },
  distributionFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  percentage: {
    color: colors.lightGray,
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    width: 80,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    marginTop: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: colors.lightGray,
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    color: colors.lightGray,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginTop: 8,
    textAlign: 'center',
  },
});
