import React from 'react';

import { TabBar, TabOption } from '@/components/TabBar/TabBar';
import { colors } from '@/config/colors';

import { TabType } from './GroupStats.types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabOption[] = [
    { id: 'stats', label: 'Stats' },
    { id: 'compare', label: 'Compare' },
    { id: 'predictions', label: 'Predictions' },
  ];

  const handleTabPress = (tabId: string | number) => {
    onTabChange(tabId as TabType);
  };

  return (
    <TabBar
      tabs={tabs}
      activeTabId={activeTab}
      onTabPress={handleTabPress}
      activeTabColor={colors.surfaceHighlight}
      activeTextColor="#FFFFFF"
      inactiveTextColor={colors.lightGray}
      style={{
        margin: 10,
        marginTop: 20,
      }}
    />
  );
};
