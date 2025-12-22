import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { OTAUpdatePrompt } from '@/components/OTAUpdate';
import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { useGroupStats } from '@/context/GroupStatsContext';
import { GROUPING_CONFIGS, groupStatsTabs } from '@/grouping-engine/GroupingConfig';
import { generateLowDataWarningMessage, shouldShowLowDataWarning } from '@/utils/groupSummary';

import { TabType } from './GroupStats.types';
import { ComparisonTab } from './tabs/ComparisonTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { StatsTab } from './tabs/StatsTab';

export const GroupStats: React.FC = () => {
  const { group, groupType } = useGroupStats();

  const [activeTab, setActiveTab] = useState<TabType>('stats');

  useEffect(() => {
    const showWarning = shouldShowLowDataWarning(group);

    if (showWarning) {
      const warningMessage = generateLowDataWarningMessage(group, groupType);

      Toast.show({
        type: 'info',
        text1: 'Low Data',
        text2: warningMessage,
        visibilityTime: 4000,
        topOffset: 60,
      });
    }
  }, [group, groupType]);

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

  // Get the gradient start color from the current group's color profile
  const activeTabColor =
    GROUPING_CONFIGS[group.type]?.colorProfile?.gradientStart || colors.primary;

  return (
    <View style={styles.statsContainer}>
      {/* OTA Update Prompt */}
      <OTAUpdatePrompt autoDownload={false} />

      <TabBar
        tabs={groupStatsTabs}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
        activeTabColor={activeTabColor}
        style={{
          marginTop: 5,
          marginHorizontal: 10,
        }}
      />

      <View style={styles.tabContentContainer}>{tabContent}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    marginTop: 10,
  },
  tabContentContainer: {
    marginTop: 10,
  },
});
