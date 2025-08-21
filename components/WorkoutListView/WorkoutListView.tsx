import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Linking, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { subheading } from '@/utils/text';
import { formatDuration } from '@/utils/time';

interface WorkoutListViewProps {
  visible: boolean;
  onClose: () => void;
  workouts: ExtendedWorkout[];
  groupTitle: string;
  accentColor?: string;
}

interface WorkoutItemProps {
  workout: ExtendedWorkout;
  index: number;
}

const WorkoutItem = ({ workout, index }: WorkoutItemProps) => {
  const formatDistance = (distance: any) => {
    if (distance?.quantity) {
      return `${distance.quantity.toFixed(2)} ${distance.unit}`;
    }
    return 'N/A';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.workoutItem}
      onPress={() => {
        if (workout.uuid) {
          Linking.openURL(`fitnessapp://workout?id=${workout.uuid}`).catch((err) =>
            console.log('Error opening Fitness app:', err),
          );
        }
      }}
    >
      <>
        <View style={styles.workoutHeader}>
          <Text style={styles.workoutNumber}>#{index + 1}</Text>
          <Text style={styles.workoutDate}>{formatDate(workout.endDate)}</Text>
        </View>

        <View style={styles.workoutStats}>
          <View style={styles.statItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#CCCCCC"
            />
            <Text style={styles.statLabel}>Distance</Text>
            <Text style={styles.statValue}>{formatDistance(workout.totalDistance)}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#CCCCCC"
            />
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(workout.duration)}</Text>
          </View>

          <View style={styles.statItem}>
            <Ionicons
              name="speedometer-outline"
              size={16}
              color="#CCCCCC"
            />
            <Text style={styles.statLabel}>Pace</Text>
            <Text style={styles.statValue}>{workout.prettyPace}</Text>
          </View>
        </View>

        {/* Achievement badges if any */}
        {(workout.achievements.isAllTimeFastest ||
          workout.achievements.isAllTimeLongest ||
          workout.achievements.isAllTimeFurthest) && (
          <View style={styles.achievementContainer}>
            {workout.achievements.isAllTimeFastest && (
              <View style={[styles.achievementBadge, { backgroundColor: '#FF6B35' }]}>
                <Text style={styles.achievementText}>FASTEST</Text>
              </View>
            )}
            {workout.achievements.isAllTimeLongest && (
              <View style={[styles.achievementBadge, { backgroundColor: '#4CAF50' }]}>
                <Text style={styles.achievementText}>LONGEST</Text>
              </View>
            )}
            {workout.achievements.isAllTimeFurthest && (
              <View style={[styles.achievementBadge, { backgroundColor: '#2196F3' }]}>
                <Text style={styles.achievementText}>FURTHEST</Text>
              </View>
            )}
          </View>
        )}
      </>
    </TouchableOpacity>
  );
};

export const WorkoutListView = ({
  visible,
  onClose,
  workouts,
  groupTitle,
  accentColor = colors.accent,
}: WorkoutListViewProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.header, { backgroundColor: accentColor }]}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All {groupTitle} Workouts</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.subHeader}>
          <Text style={styles.workoutCount}>
            {workouts.length} workout{workouts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={workouts}
          keyExtractor={(item, index) => `${item.startDate.getTime()}-${index}`}
          renderItem={({ item, index }) => (
            <WorkoutItem
              workout={item}
              index={index}
            />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  workoutCount: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  workoutItem: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
  },
  workoutDate: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: LatoFonts.regular,
  },
  workoutStats: {
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: LatoFonts.regular,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
    textAlign: 'right',
  },
  achievementContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  achievementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievementText: {
    ...subheading,
  },
});
