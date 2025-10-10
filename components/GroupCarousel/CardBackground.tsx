import { GlassView } from 'expo-glass-effect';

export const CardBackground = () => (
  <GlassView
    glassEffectStyle="clear"
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
