import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { VisualCards } from '@/components/GroupStats/GroupHighlights';
import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { StatCard } from '@/components/StatCard/StatCard';
import { LatoFonts } from '@/config/fonts';

const getTabColor = (label: string) => {
  switch (label.toLowerCase()) {
    case 'fastest':
    case 'furthest':
      return '#4CAF50';
    case 'slowest':
    case 'shortest':
      return '#f32121';
    case 'most common':
      return '#FF9800';
  }
};

export const StatsTab: React.FC<TabContentProps> = ({ group, meta }) => {
  return (
    <View style={styles.container}>
      <VisualCards
        group={group}
        meta={meta}
      />

      {group.stats.map((section) => (
        <View key={section.title}>
          <Text style={styles.sectionHeader}>{section.title}</Text>
          {section.description && <Text style={styles.sectionDesc}>{section.description}</Text>}

          {section.items.map((stat) => (
            <StatCard
              key={stat.label}
              stat={stat}
              accentColor={getTabColor(section.title)}
              hasModal={!!stat.workout}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingVertical: 0,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'OrelegaOne',
    marginTop: 20,
    paddingHorizontal: 5,
    textAlign: 'left',
    marginBottom: 10,
  },
  sectionDesc: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginBottom: 15,
    paddingHorizontal: 5,
    textAlign: 'left',
  },
});
