import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

import { TabType } from './GroupStats.types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
        onPress={() => onTabChange('stats')}
      >
        <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
          Statistics
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'comparison' && styles.activeTab]}
        onPress={() => onTabChange('comparison')}
      >
        <Text style={[styles.tabText, activeTab === 'comparison' && styles.activeTabText]}>
          Comparison
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'predictions' && styles.activeTab]}
        onPress={() => onTabChange('predictions')}
      >
        <Text style={[styles.tabText, activeTab === 'predictions' && styles.activeTabText]}>
          Predictions
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    margin: 10,
    marginTop: 20,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#2A2A2A',
  },
  tabText: {
    ...subheading,
    color: '#888888',
    marginTop: 0,
    marginBottom: 0,
    padding: 0,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: LatoFonts.bold,
  },
});
