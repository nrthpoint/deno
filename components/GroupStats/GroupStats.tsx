import { ColorProfile, colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDuration } from '@/utils/time';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HalfMoonProgress } from '@/components/HalfMoonProgress';
import { SampleComparisonCard } from '@/components/SampleComparisonCard/SampleComparisonCard';
import { StatCard } from '@/components/StatCard/StatCard';
import { VariationBar } from '@/components/VariationBar';
import { Group, MetaWorkoutData } from '@/types/Groups';

export const GroupStats = ({
  group,
  meta,
  tabColor,
}: {
  group: Group;
  meta: MetaWorkoutData;
  tabColor: ColorProfile;
}) => {
  return (
    <ScrollView style={styles.statList}>
      <View
        style={[
          styles.visualCardsRow,
          { backgroundColor: tabColor ? `${tabColor.secondary}` : undefined },
        ]}
      >
        <View style={styles.visualCardHalf}>
          <HalfMoonProgress
            value={group.runs.length}
            total={meta.totalRuns}
            color={tabColor?.primary || '#4CAF50'}
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
                displayText: formatDuration(group.worst.duration),
              },
              {
                value: group.highlight.duration.quantity,
                displayText: formatDuration(group.highlight.duration),
              },
            ]}
            color="#FF9800"
            label="Duration Variation"
            width={170}
            hasTooltip={true}
            detailTitle="Performance Variation"
            detailDescription="The range of performance within this group, showing how consistent your workouts are."
            additionalInfo={[
              { label: 'Best Time', value: formatDuration(group.highlight.duration) },
              { label: 'Worst Time', value: formatDuration(group.worst.duration) },
              {
                label: 'Variation Range',
                value: formatDuration(group.totalVariation),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.container}>
        {group.stats.map((stat) => (
          <StatCard
            key={stat.label}
            stat={stat}
            groupWorkouts={stat.label === 'Total Workouts' ? group.runs : undefined}
            groupTitle={stat.label === 'Total Workouts' ? group.title : undefined}
          />
        ))}
      </View>

      <View>
        <Text style={styles.sectionHeader}>Most Recent Comparison</Text>
        <SampleComparisonCard
          colorProfile={tabColor}
          sample1={group.highlight}
          sample2={group.mostRecent}
          sample1Label="All-Time Best"
          sample2Label={`${(() => {
            const today = new Date();
            const mostRecent = group.mostRecent.endDate;
            const diffTime = Math.floor(
              (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24),
            );

            if (diffTime === 0) return 'Today';
            if (diffTime === 1) return 'Yesterday';
            if (diffTime < 7) return `${diffTime} days ago`;

            return mostRecent.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
          })()}`}
          propertiesToCompare={['duration', 'averagePace', 'distance', 'elevation', 'humidity']}
        />
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
    textAlign: 'center',
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
