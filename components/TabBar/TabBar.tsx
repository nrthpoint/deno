import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';

export interface TabOption {
  id: string | number;
  label: string;
  disabled?: boolean;
}

interface TabBarProps {
  tabs: TabOption[];
  activeTabId: string | number;
  style?: any;
  activeTabColor?: string;
  inactiveTabColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  onTabPress: (tabId: string | number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onTabPress,
  style,
  activeTabColor = '#424bff', // Default blue from your design
  inactiveTabColor = 'transparent',
  activeTextColor = '#FFFFFF',
  inactiveTextColor = '#999999',
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isDisabled = tab.disabled;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                index === 0 && styles.firstTab,
                index === tabs.length - 1 && styles.lastTab,
                isActive && [styles.activeTab, { backgroundColor: activeTabColor }],
                isDisabled && styles.disabledTab,
              ]}
              onPress={() => !isDisabled && onTabPress(tab.id)}
              activeOpacity={isDisabled ? 1 : 0.7}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && [styles.activeTabText, { color: activeTextColor }],
                  !isActive && { color: inactiveTextColor },
                  isDisabled && styles.disabledTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  firstTab: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  lastTab: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  activeTab: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledTab: {
    opacity: 0.5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    ...getLatoFont('bold'),
  },
  activeTabText: {
    fontWeight: '700',
  },
  disabledTabText: {
    color: '#666666',
  },
});
