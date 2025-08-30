import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

export interface SettingsMenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
}

interface SettingsMenuProps {
  items: SettingsMenuItem[];
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ items }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.menuItem, index === items.length - 1 && styles.lastMenuItem]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon as any}
              size={24}
              color={colors.primary}
            />
          </View>
          <View style={styles.textContainer}>
            <Text
              variant="titleMedium"
              style={styles.title}
            >
              {item.title}
            </Text>
            {item.subtitle && (
              <Text
                variant="bodyMedium"
                style={styles.subtitle}
              >
                {item.subtitle}
              </Text>
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.gray}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceHighlight,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...subheading,
    color: colors.neutral,
    fontFamily: LatoFonts.bold,
    marginTop: 0,
    fontSize: 12,
    marginBottom: 2,
  },
  subtitle: {
    color: colors.lightGray,
    fontFamily: LatoFonts.regular,
    fontSize: 14,
  },
});
