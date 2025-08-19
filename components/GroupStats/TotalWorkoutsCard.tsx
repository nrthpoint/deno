import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { WorkoutListView } from '@/components/WorkoutListView/WorkoutListView';
import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { Group } from '@/types/Groups';
import { subheading } from '@/utils/text';

interface TotalWorkoutsCardProps {
  group: Group;
}

export const TotalWorkoutsCard: React.FC<TotalWorkoutsCardProps> = ({
  group: { runs, title, skipped },
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.card]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.textContainer}>
          <Text
            style={styles.label}
          >{`${runs.length} samples used for ${title}, with ${skipped} skipped.`}</Text>
        </View>
      </TouchableOpacity>

      <WorkoutListView
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        workouts={runs}
        groupTitle={title}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    padding: 10,
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
    // ...subheading,
    marginTop: 0,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
    ...getLatoFont('regular'),
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
