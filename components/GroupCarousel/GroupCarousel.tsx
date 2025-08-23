import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

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
        parallaxScrollingScale: 0.8,
        parallaxScrollingOffset: 90,
      }}
      renderItem={({ item }) => (
        <View style={styles.carouselItem}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Svg
              width="100%"
              height="100%"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 0,
              }}
            >
              <Defs>
                <LinearGradient
                  id="grad"
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <Stop
                    offset="0%"
                    stopColor="#ebebeb"
                  />
                  <Stop
                    offset="100%"
                    stopColor="#e7e7e7"
                  />
                </LinearGradient>
              </Defs>
              <Rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                //rx="20"
                fill="url(#grad)"
              />
            </Svg>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
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
    backgroundColor: colors.primary,
    shadowColor: '#555555',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
  },
  carouselText: {
    verticalAlign: 'middle',
    lineHeight: 80,
    textAlign: 'center',
    fontSize: 80,
    fontWeight: 'bold',
    fontFamily: 'OrelegaOne',
    color: colors.other,
  },
  carouselSubText: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'OrelegaOne',
    color: colors.other,
  },
});
