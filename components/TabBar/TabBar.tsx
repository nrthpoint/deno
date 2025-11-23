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
  transparent?: boolean;
  onTabPress: (tabId: string | number) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  style,
  activeTabId,
  activeTabColor = '#424bff',
  transparent = false,
  onTabPress,
}) => {
  // Find the index of the active tab
  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);

  // Initialize animated value with the correct starting position
  const animatedValue = useRef(
    new Animated.Value(activeTabIndex >= 0 ? activeTabIndex : 0),
  ).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render, just set the position
    if (isFirstRender.current) {
      isFirstRender.current = false;
      animatedValue.setValue(activeTabIndex >= 0 ? activeTabIndex : 0);
      return;
    }

    Animated.timing(animatedValue, {
      toValue: activeTabIndex,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [activeTabIndex, animatedValue]);

  const BackgroundSlider = () => (
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
  );

  const TabItem = ({
    tab,
    index,
    isActive,
    isDisabled,
  }: {
    tab: TabOption;
    index: number;
    isActive: boolean;
    isDisabled: boolean;
  }) => (
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
          isActive && styles.activeTabText,
          isActive && transparent && styles.activeTabTextTransparent,
          !isActive && styles.inactiveTabText,
          isDisabled && styles.disabledTabText,
        ]}
      >
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, transparent && styles.transparentContainer, style]}>
      <View style={styles.tabContainer}>
        <BackgroundSlider />

        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isDisabled = tab.disabled;

          return (
            <TabItem
              tab={tab}
              index={index}
              isActive={isActive}
              isDisabled={isDisabled ?? false}
              key={tab.id}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    overflow: 'hidden',
  },
  transparentContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 4,
    position: 'relative',
  },
  slidingIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 8,
    shadowColor: '#252525',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
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
    color: colors.neutral,
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
    color: colors.surface,
  },
  activeTabTextTransparent: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledTabText: {
    color: '#666666',
  },
});
