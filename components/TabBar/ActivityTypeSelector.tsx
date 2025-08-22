import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TabBar, TabOption } from '@/components/TabBar';
import { getLatoFont } from '@/config/fonts';

// Example usage component demonstrating the TabBar
export const ActivityTypeSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState('running');

  const activityTabs: TabOption[] = [
    { id: 'running', label: 'Running' },
    { id: 'walking', label: 'Walking', disabled: true },
    { id: 'cycling', label: 'Cycling', disabled: true },
  ];

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
    // Handle the tab change logic here
    console.log('Selected activity:', tabId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ACTIVITY TYPE</Text>
      <TabBar
        tabs={activityTabs}
        activeTabId={activeTab}
        onTabPress={handleTabPress}
        activeTabColor="#282E9A" // Blue color from your design
        inactiveTabColor="transparent"
        activeTextColor="#FFFFFF"
        inactiveTextColor="#999999"
        style={styles.tabBarStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
    ...getLatoFont('bold'),
  },
  tabBarStyle: {
    paddingHorizontal: 0,
  },
});
