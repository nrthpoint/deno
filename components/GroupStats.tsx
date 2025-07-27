import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { WorkoutGroupWithHighlight } from '@/types/workout';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { StatCard } from './StatCard';
import { formatDuration } from '@/utils/time';

const getStatIcon = (label: string) => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('time') || lowerLabel.includes('duration')) {
    return <Ionicons name="time" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('distance')) {
    return <Ionicons name="location" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('pace') || lowerLabel.includes('speed')) {
    return <Ionicons name="speedometer" size={40} color="#FFFFFF" />;
  }

  if (lowerLabel.includes('heart') || lowerLabel.includes('hr')) {
    return <Ionicons name="heart" size={40} color="#FFFFFF" />;
  }

  return <Ionicons name="stats-chart" size={40} color="#FFFFFF" />;
};

export const GroupStats = ({ group }: { group: WorkoutGroupWithHighlight }) => {
  return (
    <ScrollView style={styles.statList}>
      <StatCard
        icon={<Ionicons name="pie-chart" size={40} color="#FFFFFF" />}
        label="Percentage of Total Workouts"
        value={`${group.percentageOfTotalWorkouts?.toFixed(1)}%`}
        backgroundColor="#2A2A2A"
        accentColor="#4CAF50"
        hasTooltip={true}
        detailTitle="Workout Distribution"
        detailDescription="This shows what percentage of your total workouts fall into this specific group or category."
        additionalInfo={[
          { label: 'Total Workouts in Group', value: '12' },
          { label: 'Total Workouts Overall', value: '50' },
          { label: 'Group Ranking', value: '#2 most common' },
        ]}
      />

      <StatCard
        icon={<Ionicons name="trending-up" size={40} color="#FFFFFF" />}
        label="Total Variation"
        value={formatDuration(group.totalVariation?.quantity)}
        backgroundColor="#2A2A2A"
        accentColor="#FF9800"
        hasTooltip={true}
        detailTitle="Performance Variation"
        detailDescription="The range of performance within this group, showing how consistent your workouts are."
      />

      <Text style={styles.sectionHeader}>Best Run</Text>

      {group.stats.map((stat) => (
        <StatCard
          key={stat.label}
          icon={getStatIcon(stat.label)}
          label={stat.label}
          value={stat.value}
          backgroundColor="#2A2A2A"
          accentColor="#4d4d4dff"
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statList: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
