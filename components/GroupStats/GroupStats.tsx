import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SampleType } from '@/components/ComparisonCard/ComparisonCard.types';
import { colors } from '@/config/colors';

import { GroupStatsProps, TabType } from './GroupStats.types';
import { TabNavigation } from './TabNavigation';
import { ComparisonTab } from './tabs/ComparisonTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { StatsTab } from './tabs/StatsTab';

export const GroupStats: React.FC<GroupStatsProps> = ({ group, meta }) => {
  const [selectedSample1Type, setSelectedSample1Type] = useState<SampleType>('highlight');
  const [selectedSample2Type, setSelectedSample2Type] = useState<SampleType>('mostRecent');
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'predictions':
        return (
          <PredictionsTab
            group={group}
            meta={meta}
          />
        );

      case 'compare':
        return (
          <ComparisonTab
            group={group}
            meta={meta}
            selectedSample1Type={selectedSample1Type}
            selectedSample2Type={selectedSample2Type}
            onSample1Change={setSelectedSample1Type}
            onSample2Change={setSelectedSample2Type}
          />
        );

      default:
        return (
          <StatsTab
            group={group}
            meta={meta}
          />
        );
    }
  };

  return (
    <View style={styles.shadowContainer}>
      <View style={styles.statList}>
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 20,
  },
  statList: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
