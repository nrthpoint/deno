import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { Bird } from './Bird';

interface BirdData {
  id: number;
  startDelay: number;
  yPosition: number;
  size: number;
  speed: number;
  restartDelay: number;
}

interface FlyingBirdProps {
  bird: BirdData;
  screenWidth: number;
}

const FlyingBird: React.FC<FlyingBirdProps> = ({ bird, screenWidth }) => {
  const translateX = useSharedValue(-50);
  const translateY = useSharedValue(bird.yPosition);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Fade in
    opacity.value = withDelay(bird.startDelay, withTiming(0.6, { duration: 1000 }));

    // Wing flapping (infinite)
    scale.value = withDelay(
      bird.startDelay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0.85, { duration: 200, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        true,
      ),
    );

    // Vertical bobbing (infinite)
    translateY.value = withDelay(
      bird.startDelay,
      withRepeat(
        withSequence(
          withTiming(bird.yPosition + 12, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(bird.yPosition - 12, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      ),
    );

    // Horizontal flight (infinite loop)
    translateX.value = withDelay(
      bird.startDelay,
      withRepeat(
        withSequence(
          withTiming(screenWidth + 50, {
            duration: bird.speed,
            easing: Easing.linear,
          }),
          withDelay(bird.restartDelay, withTiming(-50, { duration: 0 })),
        ),
        -1,
        false,
      ),
    );

    return () => {
      isMountedRef.current = false;
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [bird, opacity, scale, screenWidth, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.bird, animatedStyle]}>
      <Bird
        size={bird.size}
        color="rgba(255, 255, 255, 0.6)"
      />
    </Animated.View>
  );
};

interface FlyingBirdsProps {
  count?: number;
}

export const FlyingBirds: React.FC<FlyingBirdsProps> = ({ count = 3 }) => {
  const screenWidth = Dimensions.get('window').width;

  const birds: BirdData[] = Array.from({ length: count }).map((_, i) => ({
    id: i,
    startDelay: i * 1500 + Math.random() * 1000,
    yPosition: 60 + i * 40 + Math.random() * 20,
    size: 14 + Math.random() * 4,
    speed: 10000 + Math.random() * 2000,
    restartDelay: 4000 + Math.random() * 3000,
  }));

  return (
    <View
      style={styles.container}
      pointerEvents="none"
    >
      {birds.map((bird) => (
        <FlyingBird
          key={bird.id}
          bird={bird}
          screenWidth={screenWidth}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  bird: {
    position: 'absolute',
  },
});
