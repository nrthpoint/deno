import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LowDataWarning } from '@/components/LowDataWarning/LowDataWarning';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { groupStatsTabs } from '@/config/ui';
import { useGroupStats } from '@/context/GroupStatsContext';
import { generateLowDataWarningMessage, shouldShowLowDataWarning } from '@/utils/groupSummary';

import { TabType } from './GroupStats.types';
import { ComparisonTab } from './tabs/ComparisonTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { StatsTab } from './tabs/StatsTab';

export const GroupStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const { group, groupType } = useGroupStats();
  const showWarning = shouldShowLowDataWarning(group);
  const warningMessage = showWarning ? generateLowDataWarningMessage(group, groupType) : '';

  let tabContent;

  switch (activeTab) {
    case 'predictions':
      tabContent = <PredictionsTab />;
      break;

    case 'compare':
      tabContent = <ComparisonTab />;
      break;

    default:
      tabContent = <StatsTab />;
  }

  const handleTabPress = (tabId: string | number) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <View style={styles.statsContainer}>
      {showWarning && (
        <View style={styles.warningContainer}>
          <LowDataWarning message={warningMessage} />
        </View>
      )}

      <TabBar
        tabs={groupStatsTabs}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
        activeTabColor={colors.surfaceHighlight}
      />

      <View style={styles.tabContentContainer}>{tabContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  warningContainer: {
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 10,
  },
  tabContentContainer: {
    marginTop: 10,
  },
});
