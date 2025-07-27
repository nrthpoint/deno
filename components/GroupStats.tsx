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

const styles = {
  statList: {
    backgroundColor: '#0A0A0A',
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  statCard: {
    backgroundColor: '#1C1C1C',
    marginVertical: 10,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 14,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    color: '#fff',
  },
};
