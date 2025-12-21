import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

/**
 * Base dimensions for tutorial positioning (iPhone 14 Pro dimensions)
 * All tutorial positions should be designed for this baseline
 */
const BASE_DIMENSIONS = {
  width: 393,
  height: 852,
};

export interface ScaledPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Hook to scale tutorial positions consistently across different screen sizes
 * This ensures highlighted areas appear in the same relative position regardless of device
 */
export const useDimensionScaling = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  /**
   * Scales a position from base dimensions to current screen dimensions
   */
  const scalePosition = (basePosition: ScaledPosition): ScaledPosition => {
    const scaleX = dimensions.width / BASE_DIMENSIONS.width;
    const scaleY = dimensions.height / BASE_DIMENSIONS.height;

    return {
      x: basePosition.x * scaleX,
      y: basePosition.y * scaleY,
      width: basePosition.width * scaleX,
      height: basePosition.height * scaleY,
    };
  };

  /**
   * Converts current screen position back to base dimensions
   * Useful for debug mode when saving edited positions
   */
  const unscalePosition = (currentPosition: ScaledPosition): ScaledPosition => {
    const scaleX = BASE_DIMENSIONS.width / dimensions.width;
    const scaleY = BASE_DIMENSIONS.height / dimensions.height;

    return {
      x: currentPosition.x * scaleX,
      y: currentPosition.y * scaleY,
      width: currentPosition.width * scaleX,
      height: currentPosition.height * scaleY,
    };
  };

  /**
   * Gets current scale factors
   */
  const getScaleFactors = () => ({
    scaleX: dimensions.width / BASE_DIMENSIONS.width,
    scaleY: dimensions.height / BASE_DIMENSIONS.height,
  });

  return {
    dimensions,
    baseDimensions: BASE_DIMENSIONS,
    scalePosition,
    unscalePosition,
    getScaleFactors,
  };
};
