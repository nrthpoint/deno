import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TabContentProps } from '@/components/GroupStats/GroupStats.types';
import { StatCard } from '@/components/StatCard/StatCard';
import { LatoFonts } from '@/config/fonts';

export const StatsTab: React.FC<TabContentProps> = ({ group }) => {
  return (
    <View style={styles.container}>
      {group.stats.map((section) => (
        <View key={section.title}>
          <Text style={styles.sectionHeader}>{section.title}</Text>

          {section.items.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
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
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
