import { useState } from 'react';
import { ColorProfile, colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { formatDuration } from '@/utils/time';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HalfMoonProgress } from '@/components/HalfMoonProgress';
import { SampleComparisonCard } from '@/components/SampleComparisonCard/SampleComparisonCard';
import {
  SampleOption,
  SampleType,
} from '@/components/SampleComparisonCard/SampleComparisonCard.types';
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
  const [selectedSample1Type, setSelectedSample1Type] = useState<SampleType>('highlight');
  const [selectedSample2Type, setSelectedSample2Type] = useState<SampleType>('mostRecent');

  // Create sample options from the group data
  const sampleOptions: SampleOption[] = [
    {
      type: 'highlight',
      label: 'All-Time Best',
      workout: group.highlight,
    },
    {
      type: 'worst',
      label: 'Worst Performance',
      workout: group.worst,
    },
    {
      type: 'mostRecent',
      label: (() => {
        const today = new Date();
        const mostRecent = group.mostRecent.endDate;
        const diffTime = Math.floor(
          (today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffTime === 0) return 'Today';
        if (diffTime === 1) return 'Yesterday';
        if (diffTime < 7) return `Most Recent (${diffTime} days ago)`;

        return mostRecent.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      })(),
      workout: group.mostRecent,
    },
  ];

  // Get the selected samples based on the current selection
  const getSelectedSample = (type: SampleType) => {
    switch (type) {
      case 'highlight':
        return group.highlight;
      case 'worst':
        return group.worst;
      case 'mostRecent':
        return group.mostRecent;
      default:
        return group.highlight;
    }
  };

  const selectedSample1 = getSelectedSample(selectedSample1Type);
  const selectedSample2 = getSelectedSample(selectedSample2Type);
  const selectedSample1Label =
    sampleOptions.find((opt) => opt.type === selectedSample1Type)?.label || 'Sample 1';
  const selectedSample2Label =
    sampleOptions.find((opt) => opt.type === selectedSample2Type)?.label || 'Sample 2';
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
                value:
                  group.totalVariation.unit === 'mi'
                    ? group.totalVariation.quantity.toFixed(2)
                    : formatDuration(group.totalVariation),
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.container}>
        {group.stats.map((section, sectionIndex) => (
          <View key={section.title}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            {section.items.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
                groupWorkouts={stat.label === 'Total Workouts' ? group.runs : undefined}
                groupTitle={stat.label === 'Total Workouts' ? group.title : undefined}
              />
            ))}
          </View>
        ))}
      </View>

      <View>
        <Text style={styles.sectionHeader}>Comparison</Text>
        <SampleComparisonCard
          colorProfile={tabColor}
          sample1={selectedSample1}
          sample2={selectedSample2}
          sample1Label={selectedSample1Label}
          sample2Label={selectedSample2Label}
          sampleOptions={sampleOptions}
          onSample1Change={setSelectedSample1Type}
          onSample2Change={setSelectedSample2Type}
          selectedSample1Type={selectedSample1Type}
          selectedSample2Type={selectedSample2Type}
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
