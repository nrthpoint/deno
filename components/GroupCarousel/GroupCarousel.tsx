import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';

import { colors } from '@/config/colors';
import { GroupType } from '@/types/Groups';

interface GroupCarouselProps {
  options: string[];
  colorProfile: any;
  itemSuffix: string;
  tolerance: number;
  groupType: GroupType;
  distanceUnit: string;
  setSelectedOption: (option: string) => void;
}

export const GroupCarousel = ({ options, itemSuffix, setSelectedOption }: GroupCarouselProps) => {
  return (
    <Carousel
      loop={false}
      width={180}
      height={180}
      data={options.length > 0 ? options : ['--']}
      scrollAnimationDuration={300}
      onSnapToItem={(index) => {
        setSelectedOption(options[index]);
      }}
      snapEnabled={true}
      style={styles.carousel}
      mode="parallax"
      modeConfig={{
        parallaxScrollingScale: 0.9,
        parallaxScrollingOffset: 50,
      }}
      renderItem={({ item }) => (
        <View style={styles.carouselItem}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.carouselText]}>{item}</Text>
            <Text style={[styles.carouselSubText]}>{itemSuffix}</Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    marginTop: 20,
    paddingHorizontal: 20,
    justifyContent: 'center',
    width: '100%',
  },
  carouselItem: {
    width: 140,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
  },
  carouselText: {
    verticalAlign: 'middle',
    lineHeight: 80,
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    fontFamily: 'OrelegaOne',
    color: colors.neutral,
  },
  carouselSubText: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'OrelegaOne',
  },
});
