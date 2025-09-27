import { View, StyleSheet, Image } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { GROUPING_CONFIGS } from '@/grouping-engine/GroupingConfig';
import { GroupType } from '@/types/Groups';

interface BackgroundImageProps {
  groupType: GroupType;
  parallaxOffset: SharedValue<number>;
}

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

export const BackgroundImage = ({ groupType, parallaxOffset }: BackgroundImageProps) => {
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

const styles = StyleSheet.create({
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
  imageWrapper: {
    flex: 1,
    zIndex: 2,
  },
});
