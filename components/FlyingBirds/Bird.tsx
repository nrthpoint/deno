import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BirdProps {
  size?: number;
  color?: string;
}

export const Bird: React.FC<BirdProps> = ({ size = 20, color = 'white' }) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        {/* Simple bird silhouette made of two curved wing paths */}
        <Path
          d="M4 12c0-2 2-4 6-4 0-2 2-2 2 0 0-2 2-2 2 0 4 0 6 2 6 4-4-1-8-1-16 0z"
          fill={color}
          opacity={0.8}
        />
        <Path
          d="M8 14c2-1 4-1 8 0-2 1-4 1-8 0z"
          fill={color}
          opacity={0.6}
        />
      </Svg>
    </View>
  );
};
