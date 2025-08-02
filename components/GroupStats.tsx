import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { MetaWorkoutData, WorkoutGroupWithHighlight } from '@/types/workout';
import { formatDuration } from '@/utils/time';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import { HalfMoonProgress } from './HalfMoonProgress';
import { StatCard } from './StatCard/StatCard';
import { Stat } from './StatCard/StatCard.types';
import { VariationBar } from './VariationBar';

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

const createGroupSizeStat = (group: WorkoutGroupWithHighlight): Stat => ({
  type: 'default',
  label: 'Total Runs in Group',
  value: { quantity: group.runs?.length || 0, unit: 'runs' },
  icon: <Ionicons name="fitness" size={40} color="#FFFFFF" />,
  hasTooltip: true,
  detailTitle: 'Group Size',
  detailDescription: 'The total number of workout sessions included in this performance group.',
  additionalInfo: [
    { label: 'Average per Week', value: `${((group.runs?.length || 0) / 4).toFixed(1)}` },
    { label: 'Group Category', value: group.title || 'Performance Group' },
  ],
});

const enhanceStatWithDefaults = (stat: any): Stat => ({
  type: stat.type || 'default',
  label: stat.label,
  value: stat.value,
  icon: getStatIcon(stat.label),
  hasTooltip: false,
});

export const GroupStats = ({
  group,
  meta,
  tabColour,
}: {
  group: WorkoutGroupWithHighlight;
  meta: MetaWorkoutData;
  tabColour?: string;
}) => {
  return (
    <ScrollView style={styles.statList}>
      <View
        style={[
          styles.visualCardsRow,
          { backgroundColor: tabColour ? `${tabColour}80` : undefined },
        ]}
      >
        <View style={styles.visualCardHalf}>
          <HalfMoonProgress
            value={group.runs.length}
            total={meta.totalRuns}
            color={tabColour || '#4CAF50'}
            label="of Total Workouts"
            size={100}
            hasTooltip={true}
            detailTitle="Workout Distribution"
            detailDescription="This shows what percentage of your total workouts fall into this specific group, for the selected time period."
            additionalInfo={[
              { label: 'Total Workouts in Group', value: group.runs.length.toString() },
              { label: 'Total Workouts Overall', value: meta.totalRuns.toString() },
              { label: 'Group Ranking', value: `${group.rankLabel}` },
            ]}
          />
        </View>

        <View style={styles.visualCardHalf}>
          <VariationBar
            values={[
              {
                value: group.worst.duration.quantity,
                displayText: formatDuration(group.worst.duration.quantity),
              },
              {
                value: group.highlight.duration.quantity,
                displayText: formatDuration(group.highlight.duration.quantity),
              },
            ]}
            color="#FF9800"
            label="Duration Variation"
            width={170}
            hasTooltip={true}
            detailTitle="Performance Variation"
            detailDescription="The range of performance within this group, showing how consistent your workouts are."
            additionalInfo={[
              { label: 'Best Time', value: formatDuration(group.highlight.duration.quantity) },
              { label: 'Worst Time', value: formatDuration(group.worst.duration.quantity) },
              {
                label: 'Variation Range',
                value: formatDuration(
                  Math.abs(group.worst.duration.quantity - group.highlight.duration.quantity),
                ),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.container}>
        <StatCard stat={createGroupSizeStat(group)} />

        {group.stats.map((stat) => (
          <StatCard key={stat.label} stat={enhanceStatWithDefaults(stat)} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statList: {
    backgroundColor: colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 0,
  },
  visualCardsRow: {
    flexDirection: 'row',
    gap: 18,
    padding: 10,
    marginBottom: 10,
  },
  visualCardHalf: {
    //backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingVertical: 16,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    marginHorizontal: 5,
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
