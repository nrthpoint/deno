import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/config/colors';

export const CardBackground = () => (
  <LinearGradient
    colors={[colors.neutral, colors.neutral]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 20,
      overflow: 'hidden',
    }}
  />
);
