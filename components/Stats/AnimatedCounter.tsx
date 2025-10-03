import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface AnimatedCounterProps {
  value: number;
  style?: any;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, style }) => {
  const [displayedValue, setDisplayedValue] = useState(value);

  useEffect(() => {
    const startValue = displayedValue;
    const endValue = value;
    const duration = Math.abs(endValue - startValue) * 25; // 25ms per unit

    let animationId: number;
    let startTime: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.round(startValue + (endValue - startValue) * progress);
      setDisplayedValue(currentValue);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (startValue !== endValue) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [displayedValue, value]);

  return <Text style={style}>{displayedValue}</Text>;
};
