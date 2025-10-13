import { MaterialCommunityIcons } from '@expo/vector-icons';
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
import { uppercase } from '@/utils/text';

const getRankingIcon = (level: string): keyof typeof MaterialCommunityIcons.glyphMap => {
  switch (level) {
    case 'Elite':
      return 'crown';
    case 'Advanced':
      return 'medal';
    case 'Intermediate':
      return 'trophy-variant';
    case 'Beginner':
      return 'star';
    default:
      return 'run';
  }
};

interface LevelCardProps {
  level: LevelData;
  isUserLevel: boolean;
  distanceUnit: string;
}

const LevelCard: React.FC<LevelCardProps> = ({ level, isUserLevel, distanceUnit }) => {
  const levelColor = getLevelColor(level.level);
  const intensity = getLevelIntensity(level.level);

  return (
    <Card
      style={[
        styles.levelCard,
        {
          backgroundColor: `${levelColor}${Math.round(intensity * 255)
            .toString(16)
            .padStart(2, '0')}`,
          borderColor: levelColor,
          borderWidth: 2,
        },
      ]}
    >
      <Card.Content style={styles.levelCardContent}>
        <View style={styles.levelHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelName}>
              {level.level}
              {isUserLevel && ' (You)'}
            </Text>
            <Text style={styles.levelRange}>
              {level.minTime} - {level.maxTime}
            </Text>
            <Text style={styles.paceRange}>
              Pace: {level.minPace.toFixed(2)} - {level.maxPace.toFixed(2)} min/{distanceUnit}
            </Text>
          </View>
          <MaterialCommunityIcons
            name={getRankingIcon(level.level)}
            size={38}
            color={colors.background}
            style={styles.levelIcon}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

export default function RankingLevelsModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { distanceUnit } = useSettings();

  const [levels, setLevels] = useState<LevelData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const distance = Array.isArray(params.distance)
    ? parseFloat(params.distance[0])
    : parseFloat(params.distance as string);
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
            <View style={styles.performanceContainer}>
              <View style={styles.performanceInfo}>
                <Text style={styles.levelText}>{ranking.level}</Text>
                <Text style={styles.rankText}>RANK #{ranking.rank}</Text>
                <Text style={styles.percentileText}>
                  Top {(100 - ranking.better_than_percent).toFixed(1)}%
                </Text>
              </View>
              <MaterialCommunityIcons
                name={getRankingIcon(ranking.level)}
                size={38}
                color={colors.background}
                style={styles.performanceIcon}
              />
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
              const isUserLevel = level.level.toLowerCase() === ranking.level.toLowerCase();
              return (
                <LevelCard
                  key={level.level}
                  level={level}
                  isUserLevel={isUserLevel}
                  distanceUnit={distanceUnit === 'km' ? 'km' : 'mi'}
                />
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
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  performanceContainer: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  performanceInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelText: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  rankText: {
    ...uppercase,
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 6,
  },
  percentileText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.8,
  },
  performanceIcon: {
    marginRight: 4,
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelCardContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  levelHeader: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  levelInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  levelName: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
  },
  levelRange: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 6,
  },
  paceRange: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    opacity: 0.8,
  },
  levelIcon: {
    marginRight: 4,
  },
});
