import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

export const CardBackground = () => (
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
);
