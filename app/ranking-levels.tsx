import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Card, Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { useSettings } from '@/context/SettingsContext';
import {
  getLevelColor,
  getLevelIntensity,
  LevelData,
  RankingResponse,
  rankingService,
} from '@/services/rankingService';

export default function RankingLevelsModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { distanceUnit } = useSettings();

  const [levels, setLevels] = useState<LevelData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const distance = parseFloat(params.distance as string);
  const ranking: RankingResponse = JSON.parse(params.ranking as string);

  useEffect(() => {
    const loadLevels = async () => {
      try {
        setLoading(true);
        // Using the provided Elite level data
        const levels = await rankingService.getLevels(
          distance,
          distanceUnit === 'km' ? 'km' : 'mile',
        );
        setLevels(levels.levels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load levels');
      } finally {
        setLoading(false);
      }
    };

    loadLevels();
  }, [distance, distanceUnit]);

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={`${distance}K Performance Levels`}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        {/* Your Performance Card */}
        <Card
          style={[
            styles.yourPerformanceCard,
            {
              backgroundColor: `${getLevelColor(ranking.level)}${Math.round(
                getLevelIntensity(ranking.level) * 255,
              )
                .toString(16)
                .padStart(2, '0')}`,
              borderColor: getLevelColor(ranking.level),
            },
          ]}
        >
          <Card.Content style={styles.cardContent}>
            <Text style={styles.yourPerformanceTitle}>Your Performance</Text>
            <View style={styles.performanceRow}>
              <Text style={styles.levelText}>{ranking.level}</Text>
              <Text style={styles.rankText}>Rank #{ranking.rank}</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Your Time</Text>
                <Text style={styles.statValue}>{ranking.your_time}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Better Than</Text>
                <Text style={styles.statValue}>{ranking.better_than_percent}%</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* All Levels */}
        <Text style={styles.sectionTitle}>Performance Levels</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={colors.primary}
            />
            <Text style={styles.loadingText}>Loading performance levels...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
            </Card.Content>
          </Card>
        ) : levels ? (
          <View style={styles.levelsContainer}>
            {levels.map((level) => {
              console.log(level);
              const isUserLevel = level.level.toLowerCase() === ranking.level.toLowerCase();
              const levelColor = getLevelColor(level.level);
              const intensity = getLevelIntensity(level.level);

              return (
                <Card
                  key={level.level}
                  style={[
                    styles.levelCard,
                    isUserLevel && styles.userLevelCard,
                    {
                      backgroundColor: `${levelColor}${Math.round(intensity * 255)
                        .toString(16)
                        .padStart(2, '0')}`,
                      borderColor: isUserLevel ? levelColor : 'transparent',
                    },
                  ]}
                >
                  <Card.Content style={styles.levelCardContent}>
                    <View style={styles.levelHeader}>
                      <Text style={[styles.levelName, isUserLevel && styles.userLevelName]}>
                        {level.level}
                        {isUserLevel && ' (You)'}
                      </Text>
                    </View>

                    <View style={styles.levelDetails}>
                      <Text style={styles.levelRange}>
                        {level.minTime} - {level.maxTime}
                      </Text>
                      <Text style={styles.paceRange}>
                        Pace: {level.minPace.toFixed(2)} - {level.maxPace.toFixed(2)} min/km
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  yourPerformanceCard: {
    marginBottom: 24,
    borderWidth: 2,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 20,
  },
  yourPerformanceTitle: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 12,
    textAlign: 'center',
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  rankText: {
    fontSize: 18,
    fontFamily: LatoFonts.semiBold,
    color: colors.neutral,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.7,
  },
  errorCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    textAlign: 'center',
  },
  levelsContainer: {
    gap: 12,
  },
  levelCard: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userLevelCard: {
    borderWidth: 2,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  levelCardContent: {
    padding: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelName: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  userLevelName: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
  },
  levelDetails: {
    gap: 8,
  },
  levelRange: {
    fontSize: 16,
    fontFamily: LatoFonts.semiBold,
    color: colors.neutral,
  },
  paceRange: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    opacity: 0.8,
  },
});
