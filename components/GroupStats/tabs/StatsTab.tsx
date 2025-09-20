import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CollapsibleStatSection } from '@/components/CollapsibleStatSection/CollapsibleStatSection';
import { VisualCards } from '@/components/GroupStats/GroupHighlights';
import { GroupSummaryHeader } from '@/components/GroupSummaryHeader/GroupSummaryHeader';
import { ProgressionCard } from '@/components/ProgressionCard/ProgressionCard';
import { useGroupStats } from '@/context/GroupStatsContext';
import { generateGroupSummary } from '@/utils/groupSummary';
import { generateProgressionData } from '@/utils/progression';

const getTabColor = (label: string) => {
  switch (label.toLowerCase()) {
    case 'fastest':
    case 'furthest':
      return '#4CAF50';
    case 'slowest':
    case 'shortest':
      return '#f32121';
    case 'most common':
      return '#FF9800';
    case 'highest':
      return '#2196F3';
    case 'lowest':
      return '#9C27B0';
  }
};

export const StatsTab: React.FC = () => {
  const { group, groupType, timeRangeInDays } = useGroupStats();
  const summary = generateGroupSummary(group, groupType, timeRangeInDays);
  const progressionData = generateProgressionData(group, groupType, timeRangeInDays);

  return (
    <>
      <View style={styles.headingContainer}>
        <GroupSummaryHeader summary={summary} />
        <VisualCards />
      </View>

      <ProgressionCard
        title={progressionData.title}
        description={progressionData.description}
        entries={progressionData.entries}
        metricLabel={progressionData.metricLabel}
      />

      {group.stats.map((section, index) => (
        <CollapsibleStatSection
          key={section.title}
          section={section}
          getTabColor={getTabColor}
          initialExpanded={true}
          alternatingBackground={index % 2 === 0}
        />
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  headingContainer: {
    paddingHorizontal: 10,
    gap: 10,
  },
});
