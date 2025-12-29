import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import AppInfo from '@/components/AppInfo/AppInfo';
import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

export const AppInfoSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.section, { borderBottomWidth: 0 }]}>
      <Pressable
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.neutral}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.sectionTitle}>App Info</Text>
          <Text style={styles.sectionSubtitle}>Version information and updates</Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colors.lightGray}
        />
      </Pressable>
      {isExpanded && <AppInfo />}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: -2,
  },
  textContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...subheading,
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
    marginTop: 0,
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionSubtitle: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
    fontSize: 14,
  },
});
