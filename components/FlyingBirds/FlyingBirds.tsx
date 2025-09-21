import React, { useEffect, useState, useRef } from 'react';
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
  const timeoutRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Fade in
    opacity.value = withDelay(bird.startDelay, withTiming(0.6, { duration: 1000 }));

    // Wing flapping animation (simpler approach)
    scale.value = withDelay(
      bird.startDelay,
      withRepeat(
        withSequence(
          withTiming(1.15, { duration: 200, easing: Easing.out(Easing.quad) }),
          withTiming(0.85, { duration: 200, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );

    // Vertical bobbing motion
    translateY.value = withDelay(
      bird.startDelay,
      withRepeat(
        withSequence(
          withTiming(bird.yPosition + 12, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
          withTiming(bird.yPosition - 12, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      ),
    );

    // Horizontal flight with safe restart
    const startFlight = () => {
      if (!isMountedRef.current) return;

      translateX.value = -50;
      translateX.value = withTiming(
        screenWidth + 50,
        { duration: bird.speed, easing: Easing.linear },
        (finished) => {
          if (finished && isMountedRef.current) {
            // Clear any existing timeout
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }

            // Schedule next flight safely
            timeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                startFlight();
              }
            }, bird.restartDelay);
          }
        },
      );
    };

    // Start first flight after initial delay
    const initialTimeout = setTimeout(() => {
      if (isMountedRef.current) {
        startFlight();
      }
    }, bird.startDelay);

    // Cleanup function
    return () => {
      isMountedRef.current = false;

      // Clear timeouts
      clearTimeout(initialTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Cancel animations
      cancelAnimation(translateX);
      cancelAnimation(translateY);
      cancelAnimation(opacity);
      cancelAnimation(scale);
    };
  }, [
    bird.startDelay,
    bird.yPosition,
    bird.speed,
    bird.restartDelay,
    screenWidth,
    opacity,
    scale,
    translateY,
    translateX,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scaleX: scale.value },
      ],
      opacity: opacity.value,
    };
  });

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
  const [birds, setBirds] = useState<BirdData[]>([]);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Generate bird data with stable characteristics
    const birdData: BirdData[] = [];
    for (let i = 0; i < count; i++) {
      birdData.push({
        id: i,
        startDelay: i * 1500 + Math.random() * 1000, // Staggered start with more spacing
        yPosition: 60 + i * 40 + Math.random() * 20, // More distributed heights
        size: 14 + Math.random() * 4, // Size between 14-18
        speed: 10000 + Math.random() * 2000, // Speed between 10-12 seconds
        restartDelay: 4000 + Math.random() * 3000, // Restart delay 4-7 seconds
      });
    }
    setBirds(birdData);
  }, [count]);

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
    zIndex: 5, // Above background image but below carousel items
  },
  bird: {
    position: 'absolute',
  },
});
