import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  style,
  activeTabColor = '#424bff', // Default blue from your design
  inactiveTabColor = 'transparent',
  activeTextColor = '#FFFFFF',
  inactiveTextColor = '#999999',
  onTabPress,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Find the index of the active tab
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);

  useEffect(() => {
    // Animate to the active tab position
    Animated.timing(animatedValue, {
      toValue: activeTabIndex,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [activeTabIndex, animatedValue]);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabContainer}>
        {/* Sliding background indicator */}
        <Animated.View
          style={[
            styles.slidingIndicator,
            {
              backgroundColor: activeTabColor,
              width: `${100 / tabs.length}%`,
              transform: [
                {
                  translateX: animatedValue.interpolate({
                    inputRange: [0, tabs.length - 1],
                    outputRange: ['0%', `${(tabs.length - 1) * 100}%`],
                  }),
                },
              ],
            },
          ]}
        />

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
    position: 'relative',
  },
  slidingIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
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
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    ...getLatoFont('bold'),
  },
  activeTabText: {
    fontWeight: '700',
  },
  disabledTabText: {
    color: '#666666',
  },
});
