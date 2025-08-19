import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { SampleType } from '@/components/SampleComparisonCard/SampleComparisonCard.types';
import { colors } from '@/config/colors';

import { GroupStatsProps, TabType } from './GroupStats.types';
import { TabNavigation } from './TabNavigation';
import { ComparisonTab } from './tabs/ComparisonTab';
import { PredictionsTab } from './tabs/PredictionsTab';
import { StatsTab } from './tabs/StatsTab';
import { TotalWorkoutsCard } from './TotalWorkoutsCard';
import { VisualCards } from './VisualCards';

export const GroupStats: React.FC<GroupStatsProps> = ({ group, meta, tabColor }) => {
  const [selectedSample1Type, setSelectedSample1Type] = useState<SampleType>('highlight');
  const [selectedSample2Type, setSelectedSample2Type] = useState<SampleType>('mostRecent');
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  console.log('tabColor:', tabColor);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'stats':
        return <StatsTab group={group} meta={meta} tabColor={tabColor} />;
      case 'predictions':
        return <PredictionsTab group={group} meta={meta} tabColor={tabColor} />;
      case 'compare':
        return (
          <ComparisonTab
            group={group}
            meta={meta}
            tabColor={tabColor}
            selectedSample1Type={selectedSample1Type}
            selectedSample2Type={selectedSample2Type}
            onSample1Change={setSelectedSample1Type}
            onSample2Change={setSelectedSample2Type}
          />
        );
      default:
        return <StatsTab group={group} meta={meta} tabColor={tabColor} />;
    }
  };

  return (
    <ScrollView style={styles.statList}>
      <TotalWorkoutsCard group={group} />
      <VisualCards group={group} meta={meta} tabColor={tabColor} />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderTabContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  statList: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
