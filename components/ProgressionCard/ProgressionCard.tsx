import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';
import { subheading } from '@/utils/text';

export interface ProgressionEntry {
  date: string;
  value: string;
  isImprovement: boolean;
}

interface ProgressionCardProps {
  title: string;
  description: string;
  entries: ProgressionEntry[];
  metricLabel: string;
}

export const ProgressionCard: React.FC<ProgressionCardProps> = ({
  title,
  description,
  entries,
  metricLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.headerContainer}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <View style={[styles.headerContent, isExpanded && styles.headerContentExpanded]}>
            <Text style={styles.title}>{title}</Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#FFFFFF"
              style={styles.chevronIcon}
            />
          </View>
          {isExpanded && <Text style={styles.description}>{description}</Text>}
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.noDataContainerWrapper}>
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Not enough data to show progression</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={[styles.headerContent, isExpanded && styles.headerContentExpanded]}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#FFFFFF"
            style={styles.chevronIcon}
          />
        </View>
        {isExpanded && <Text style={styles.description}>{description}</Text>}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.tableContainer}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Date</Text>
              <Text style={styles.headerCell}>{metricLabel}</Text>
              <Text style={styles.headerCell}>Change</Text>
            </View>

            {entries.reverse().map((entry, index) => (
              <View
                key={index}
                style={styles.tableRow}
              >
                <Text style={styles.cell}>{entry.date}</Text>
                <Text style={styles.cell}>{entry.value}</Text>
                <View style={styles.changeCell}>
                  {index !== entries.length - 1 && index !== 0 && (
                    <Ionicons
                      name={entry.isImprovement ? 'trending-up' : 'trending-down'}
                      size={16}
                      color={entry.isImprovement ? '#4CAF50' : '#f32121'}
                    />
                  )}
                  {index === 0 && (
                    <Ionicons
                      name="star"
                      size={16}
                      color="#FFD700"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },
  headerContentExpanded: {
    paddingBottom: 0,
  },
  title: {
    ...subheading,
    marginTop: 0,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    textAlign: 'left',
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left',
  },
  noDataContainerWrapper: {
    paddingBottom: 15,
  },
  noDataContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noDataText: {
    color: '#999999',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    fontStyle: 'italic',
  },
  tableContainer: {
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.surface,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  cell: {
    flex: 1,
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: LatoFonts.regular,
    textAlign: 'center',
  },
  changeCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
