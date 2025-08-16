import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { WorkoutListView } from '@/components/WorkoutListView/WorkoutListView';
import { colors } from '@/config/colors';
import { Group } from '@/types/Groups';
import { subheading } from '@/utils/text';

interface TotalWorkoutsCardProps {
  group: Group;
  accentColor?: string;
}

export const TotalWorkoutsCard: React.FC<TotalWorkoutsCardProps> = ({
  group: { runs, title, skipped },
  accentColor,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const color = accentColor || colors.accent;
  const unit = 'runs';

  return (
    <>
      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.textContainer}>
          <Ionicons name="fitness-outline" size={32} color="#fff" style={{ marginTop: -4 }} />
          <Text style={styles.label}>
            Total {unit}: {runs.length}
          </Text>
          <Text style={styles.minorLabel}>({skipped} Skipped)</Text>
        </View>
      </TouchableOpacity>

      <WorkoutListView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        workouts={runs}
        groupTitle={title}
        accentColor={color}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    padding: 16,
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: 4,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  label: {
    ...subheading,
    marginTop: 0,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  minorLabel: {
    ...subheading,
    marginTop: 0,
    fontSize: 16,
    color: '#a1a1a1',
    fontWeight: 'thin',
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
