import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CollapsibleStatSection } from '@/components/CollapsibleStatSection/CollapsibleStatSection';
import { VisualCards } from '@/components/GroupStats/GroupHighlights';
import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { GroupSummaryHeader } from '@/components/GroupSummaryHeader/GroupSummaryHeader';
import { LowDataWarning } from '@/components/LowDataWarning/LowDataWarning';
import { ProgressionCard } from '@/components/ProgressionCard/ProgressionCard';
import {
  generateGroupSummary,
  generateLowDataWarningMessage,
  shouldShowLowDataWarning,
} from '@/utils/groupSummary';
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

export const StatsTab: React.FC<TabContentProps> = ({
  group,
  meta,
  groupType,
  timeRangeInDays,
}) => {
  const summary = generateGroupSummary(group, groupType, timeRangeInDays);
  const showWarning = shouldShowLowDataWarning(group);
  const warningMessage = showWarning ? generateLowDataWarningMessage(group, groupType) : '';
  const progressionData = generateProgressionData(group, groupType, timeRangeInDays);

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 16 }}>
        <GroupSummaryHeader summary={summary} />

        {showWarning && <LowDataWarning message={warningMessage} />}

        <VisualCards
          group={group}
          meta={meta}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
