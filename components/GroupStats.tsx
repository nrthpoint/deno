import { styles } from '@/app/(tabs)';
import { WorkoutGroupWithHighlight } from '@/types/workout';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';

export const GroupStats = ({ group }: { group: WorkoutGroupWithHighlight }) => {
  return (
    <ScrollView style={styles.statList}>
      <Text style={styles.sectionHeader}>Group Statistics</Text>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text style={styles.statLabel}>Percentage of Total Workouts</Text>
          <Text style={styles.statValue}>{group.percentageOfTotalWorkouts?.toFixed(1)}%</Text>
        </Card.Content>
      </Card>

      <Card style={styles.statCard}>
        <Card.Content>
          <Text style={styles.statLabel}>Total Variation</Text>
          <Text style={styles.statValue}>
            {group.totalVariation?.quantity?.toFixed(2)} {group.totalVariation?.unit}
          </Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionHeader}>Best Run</Text>

      {group.stats.map((stat) => (
        <Card key={stat.label} style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};
