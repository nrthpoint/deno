import { useEffect, useRef } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import { CardBackground } from '@/components/GroupCarousel/CardBackground';
import { colors } from '@/config/colors';
import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { GroupType } from '@/types/Groups';
import { subheading, uppercase } from '@/utils/text';

const getImageForGroupType = (groupType: GroupType) => {
  switch (groupType) {
    case 'distance':
      return require('@/assets/images/carousel/distance.jpg');
    case 'pace':
      return require('@/assets/images/carousel/pace.jpg');
    case 'elevation':
      return require('@/assets/images/carousel/elevation.jpg');
    case 'duration':
      return require('@/assets/images/carousel/duration.jpg');
    default:
      return null;
  }
};

interface BackgroundImageProps {
  groupType: GroupType;
  parallaxOffset: SharedValue<number>;
}

const BackgroundImage = ({ groupType, parallaxOffset }: BackgroundImageProps) => {
  const image = getImageForGroupType(groupType);
  const backgroundColor = GROUPING_CONFIGS[groupType].backgroundColor;

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(parallaxOffset.value, [-100, 0, 100], [-0.1, 0, 0.1]);

    return {
      transform: [{ translateX }],
    };
  });

  if (!image) return null;

  return (
    <View style={styles.backgroundImageContainer}>
      <View style={[styles.backgroundColorLayer, { backgroundColor }]} />
      <Animated.View style={[styles.imageWrapper, animatedStyle]}>
        <Image
          source={image}
          style={styles.backgroundImage}
          width={600}
          height={250}
          resizeMode="cover"
          blurRadius={4}
        />
      </Animated.View>
    </View>
  );
};

interface GroupCarouselProps {
  options: string[];
  colorProfile: any;
  itemSuffix: string;
  tolerance: number;
  groupType: GroupType;
  distanceUnit: string;
  groups: Record<string, any>;
  setSelectedOption: (_option: string) => void;
}

export const GroupCarousel = ({
  options,
  itemSuffix,
  groupType,
  groups,
  setSelectedOption,
}: GroupCarouselProps) => {
  const carouselRef = useRef<any>(null);
  const parallaxOffset = useSharedValue(0);
  const backgroundColor = GROUPING_CONFIGS[groupType].backgroundColor;

  // Reset carousel to index 0 when group type changes.
  // TODO: Fix this, wrong use of useEffect, Ali would hate me.
  useEffect(() => {
    if (carouselRef.current && options.length > 0) {
      carouselRef.current.scrollTo({ index: 0, animated: true });
      setSelectedOption(options[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupType]);

  const deviceWidth = Dimensions.get('window').width;
  const visibleItems = 2.5; // Show 2.5 items on screen
  const padding = 40; // Total horizontal padding (20 * 2)
  const itemWidth = (deviceWidth - padding) / visibleItems;

  return (
    <View style={styles.carouselContainer}>
      <BackgroundImage
        groupType={groupType}
        parallaxOffset={parallaxOffset}
      />
      <Carousel
        ref={carouselRef}
        width={itemWidth}
        loop={false}
        height={180}
        data={options.length > 0 ? options : ['--']}
        scrollAnimationDuration={300}
        onSnapToItem={(index) => {
          setSelectedOption(options[index]);
        }}
        onProgressChange={(offsetProgress) => {
          parallaxOffset.value = offsetProgress * 100;
        }}
        style={styles.carousel}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
          parallaxAdjacentItemScale: 0.7,
        }}
        renderItem={({ item }) => {
          const group = groups[item];
          const isIndoor = group?.isIndoor || false;
          const skippedCount = group?.skipped || 0;

          return (
            <View style={styles.carouselItemContainer}>
              <View style={styles.carouselItem}>
                <CardBackground />

                <View style={styles.carouselItemContent}>
                  {isIndoor && (
                    <View style={[styles.indoorLabel, { backgroundColor: '#ff4800' }]}>
                      <Text style={styles.indoorLabelText}>Indoor</Text>
                    </View>
                  )}

                  <Text
                    style={[
                      styles.carouselText,
                      {
                        color: backgroundColor,
                        fontSize: item.length > 3 ? 60 : item.length > 2 ? 70 : 80,
                      },
                    ]}
                  >
                    {item.replace(/-indoor|-outdoor/, '')} {/* Remove the suffix from display */}
                  </Text>

                  <Text style={[styles.carouselSubText, { color: backgroundColor }]}>
                    {itemSuffix}
                  </Text>
                </View>
              </View>

              {/* Excluded workouts indicator */}
              {skippedCount > 0 && (
                <View style={styles.excludedIndicator}>
                  <Text style={styles.excludedIndicatorText}>{skippedCount} excluded</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundImageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    height: '100%',
    zIndex: -1,
    overflow: 'hidden',
  },
  backgroundColorLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  imageWrapper: {
    flex: 1,
    zIndex: 2,
  },
  backgroundImage: {
    opacity: 0.4,
    backgroundColor: 'red',
    position: 'absolute',
    bottom: -50,
    overflow: 'visible',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    height: '100%',
  },
  carousel: {
    marginTop: 200,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    overflow: 'visible',
    zIndex: 10,
  },
  carouselItemContainer: {
    alignItems: 'center',
  },
  carouselItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  carouselItem: {
    width: 140,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 20,
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
  excludedIndicator: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  excludedIndicatorText: {
    ...uppercase,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
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
    ...subheading,
    marginTop: 0,
    textAlign: 'center',
    color: colors.other,
  },
  indoorLabel: {
    position: 'absolute',
    textAlign: 'center',
    top: -10,
    borderRadius: 8,
    width: 70,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  indoorLabelText: {
    ...subheading,
    marginTop: 0,
    textAlign: 'center',
    marginBottom: 0,
    color: colors.neutral,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
