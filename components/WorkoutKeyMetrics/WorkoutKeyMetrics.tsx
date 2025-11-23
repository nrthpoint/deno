import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { Card } from '@/components/Card/Card';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

interface WorkoutKeyMetricsProps {
  distance: string;
  duration: string;
  pace: string;
  paceUnit: string;
}

export const WorkoutKeyMetrics: React.FC<WorkoutKeyMetricsProps> = ({
  distance,
  duration,
  pace,
  paceUnit,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6291FF', '#4F75E5']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.metricItem}>
        <Card style={styles.card}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={24}
              color={colors.neutral}
              style={styles.icon}
            />
            <Text style={styles.value}>{distance}</Text>
            <Text style={styles.label}>Distance</Text>
          </View>
        </Card>
      </View>

      <View style={styles.metricItem}>
        <Card style={styles.card}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color={colors.neutral}
              style={styles.icon}
            />
            <Text style={styles.value}>{duration}</Text>
            <Text style={styles.label}>Duration</Text>
          </View>
        </Card>
      </View>

      <View style={styles.metricItem}>
        <Card style={styles.card}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="speedometer"
              size={24}
              color={colors.neutral}
              style={styles.icon}
            />
            <Text style={styles.value}>{pace}</Text>
            <Text style={styles.label}>{paceUnit}</Text>
          </View>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  metricItem: {
    flex: 1,
    zIndex: 1,
  },
  card: {
    backgroundColor: 'transparent',
  },
  content: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 14,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
  },
  value: {
    fontSize: 20,
    fontFamily: LatoFonts.bold,
    color: colors.background,
    marginBottom: 4,
    textAlign: 'center',
  },
  label: {
    ...subheading,
    marginBottom: 0,
    marginTop: 5,
    fontFamily: LatoFonts.regular,
    color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
