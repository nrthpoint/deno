import { getLatoFont } from '@/config/fonts';
import { GroupType } from '@/types/groups';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

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
  colorProfile,
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
            { color: groupType === tab ? colorProfile.primary : '#FFFFFF' },
          ]}
          buttonColor={groupType === tab ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)'}
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
    marginVertical: 16,
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
