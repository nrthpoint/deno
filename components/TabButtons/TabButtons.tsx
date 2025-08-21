import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { getLatoFont } from '@/config/fonts';
import { GroupType } from '@/types/Groups';

interface TabButtonsProps {
  tabOptions: GroupType[];
  groupType: GroupType;
  colorProfile: any;
  tabOptionLabels: Record<GroupType, string>;
  setGroupingType: (type: GroupType) => void;
}

export const TabButtons = ({
  tabOptions,
  groupType,
  tabOptionLabels,
  setGroupingType,
}: TabButtonsProps) => {
  return (
    <View style={styles.tabRow}>
      {tabOptions.map((tab) => (
        <Button
          key={tab}
          mode="contained"
          onPress={() => setGroupingType(tab)}
          style={styles.tabButton}
          labelStyle={[
            styles.tabButtonText,
            { color: groupType === tab ? '#FFFFFF' : colors.lightGray },
          ]}
          buttonColor={groupType === tab ? colors.surfaceHighlight : colors.background}
        >
          {tabOptionLabels[tab]}
        </Button>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  tabButtonText: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: 'bold',
    ...getLatoFont('bold'),
  },
});
