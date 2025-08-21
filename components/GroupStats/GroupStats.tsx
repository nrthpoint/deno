import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { SampleType } from '@/components/SampleComparisonCard/SampleComparisonCard.types';
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
      case 'stats':
        return (
          <StatsTab
            group={group}
            meta={meta}
          />
        );

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
    // <ScrollView style={styles.statList}>
    <View style={styles.statList}>
      {/* <TotalWorkoutsCard group={group} /> */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {renderTabContent()}
    </View>
    // </ScrollView>
  );
};

const styles = StyleSheet.create({
  statList: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
