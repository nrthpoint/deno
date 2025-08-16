import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { WorkoutListView } from '@/components/WorkoutListView/WorkoutListView';
import { colors } from '@/config/colors';

interface TotalWorkoutsCardProps {
  groupRuns: any[];
  groupTitle: string;
  accentColor?: string;
}

export const TotalWorkoutsCard: React.FC<TotalWorkoutsCardProps> = ({
  groupRuns,
  groupTitle,
  accentColor,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const color = accentColor || colors.accent;
  const total = groupRuns?.length || 0;
  const unit = total === 1 ? 'run' : 'runs';

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name="fitness-outline" size={32} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Total Workouts</Text>
          <Text style={styles.value}>
            {total} <Text style={styles.unit}>{unit}</Text>
          </Text>
        </View>
      </TouchableOpacity>

      <WorkoutListView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        workouts={groupRuns}
        groupTitle={groupTitle}
        accentColor={color}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    marginVertical: 12,
    marginHorizontal: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: 'normal',
  },
});
