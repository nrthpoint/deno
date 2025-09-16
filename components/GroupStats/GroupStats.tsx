import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { TabBar } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';
import { groupStatsTabs } from '@/config/ui';

import { TabType } from './GroupStats.types';
import { ComparisonTab } from './tabs/ComparisonTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { StatsTab } from './tabs/StatsTab';

export const GroupStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'predictions':
        return <PredictionsTab />;

      case 'compare':
        return <ComparisonTab />;

      default:
        return <StatsTab />;
    }
  };

  const handleTabPress = (tabId: string | number) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.statList}>
        <TabBar
          tabs={groupStatsTabs}
          activeTabId={activeTab}
          onTabPress={handleTabPress}
          activeTabColor={colors.surfaceHighlight}
          style={{
            margin: 10,
          }}
        />

        {renderTabContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
  },
  statList: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
    marginTop: 10,
  },
});
