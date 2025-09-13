import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { LatoFonts } from '@/config/fonts';

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
  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Not enough data to show progression</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Date</Text>
          <Text style={styles.headerCell}>{metricLabel}</Text>
          <Text style={styles.headerCell}>Change</Text>
        </View>

        {entries.map((entry, index) => (
          <View
            key={index}
            style={styles.tableRow}
          >
            <Text style={styles.cell}>{entry.date}</Text>
            <Text style={styles.cell}>{entry.value}</Text>
            <View style={styles.changeCell}>
              {index > 0 && (
                <Text
                  style={[
                    styles.changeText,
                    entry.isImprovement ? styles.improvement : styles.regression,
                  ]}
                >
                  {entry.isImprovement ? '↗' : '↘'}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'OrelegaOne',
    marginTop: 20,
    paddingHorizontal: 5,
    textAlign: 'left',
    marginBottom: 10,
  },
  description: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    lineHeight: 20,
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
  table: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
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
  changeText: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
  },
  improvement: {
    color: '#4CAF50',
  },
  regression: {
    color: '#f32121',
  },
});
