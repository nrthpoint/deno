import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StatCard } from '@/components/StatCard/StatCard';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { StatGroup } from '@/types/Groups';
import { subheading } from '@/utils/text';

interface CollapsibleStatSectionProps {
  section: StatGroup;
  initialExpanded?: boolean;
  alternatingBackground?: boolean;
  getTabColor: (label: string) => string | undefined;
}

export const CollapsibleStatSection: React.FC<CollapsibleStatSectionProps> = ({
  section,
  initialExpanded = false,
  alternatingBackground = false,
  getTabColor,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={[styles.container, alternatingBackground && { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.sectionHeaderContainer}
        onPress={toggleSection}
        activeOpacity={0.7}
      >
        <View
          style={[styles.sectionHeaderContent, isExpanded && styles.sectionHeaderContentExpanded]}
        >
          <Text style={styles.sectionHeader}>{section.title}</Text>
          <View style={styles.chevronContainer}>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#FFFFFF"
            />
          </View>
        </View>

        {section.description && isExpanded && (
          <Text style={styles.sectionDesc}>{section.description}</Text>
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.sectionContentWrapper}>
          <View style={styles.sectionContent}>
            {section.items.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
                accentColor={getTabColor(section.title)}
                hasModal={!!stat.workout}
                darkerBackground={alternatingBackground}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  sectionHeaderContainer: {
    marginTop: 20,
    paddingVertical: 5,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  sectionHeaderContentExpanded: {
    paddingBottom: 0,
  },
  sectionHeader: {
    ...subheading,
    marginTop: 0,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    textAlign: 'left',
    flex: 1,
  },
  chevronContainer: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDesc: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginTop: 3,
    marginBottom: 10,
    maxWidth: '90%',
    lineHeight: 24,
  },
  sectionContentWrapper: {
    paddingBottom: 15,
  },
  sectionContent: {
    marginBottom: 5,
  },
});
