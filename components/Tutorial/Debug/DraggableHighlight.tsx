import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';

import { colors } from '@/config/colors';

import { ScaledPosition } from './useDimensionScaling';

interface DraggableHighlightProps {
  position: ScaledPosition;
  onPositionChange: (position: ScaledPosition) => void;
  isEditing: boolean;
}

export const DraggableHighlight: React.FC<DraggableHighlightProps> = ({
  position,
  onPositionChange,
  isEditing,
}) => {
  const pan = useRef(new Animated.ValueXY({ x: position.x, y: position.y })).current;
  const currentPosition = useRef(position);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isEditing,
      onMoveShouldSetPanResponder: () => isEditing,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPosition.current.x,
          y: currentPosition.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        const newPosition = {
          x: currentPosition.current.x + gesture.dx,
          y: currentPosition.current.y + gesture.dy,
          width: currentPosition.current.width,
          height: currentPosition.current.height,
        };
        currentPosition.current = newPosition;
        onPositionChange(newPosition);
      },
    }),
  ).current;

  // Update internal position when prop changes
  React.useEffect(() => {
    currentPosition.current = position;
    pan.setValue({ x: position.x, y: position.y });
  }, [position, pan]);

  const padding = 8;
  const borderRadius = 12;

  return (
    <Animated.View
      {...(isEditing ? panResponder.panHandlers : {})}
      style={[
        styles.highlight,
        {
          left: pan.x,
          top: pan.y,
          width: position.width + padding * 2,
          height: position.height + padding * 2,
          borderRadius: borderRadius + padding,
          borderColor: isEditing ? colors.primary : colors.primary,
          borderWidth: isEditing ? 4 : 3,
        },
      ]}
    >
      {isEditing && (
        <>
          {/* Corner handles for resizing */}
          <View style={[styles.handle, styles.handleTopLeft]} />
          <View style={[styles.handle, styles.handleTopRight]} />
          <View style={[styles.handle, styles.handleBottomLeft]} />
          <View style={[styles.handle, styles.handleBottomRight]} />

          {/* Center indicator */}
          <View style={styles.centerDot} />
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
  },
  handle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: '#fff',
  },
  handleTopLeft: {
    top: -10,
    left: -10,
  },
  handleTopRight: {
    top: -10,
    right: -10,
  },
  handleBottomLeft: {
    bottom: -10,
    left: -10,
  },
  handleBottomRight: {
    bottom: -10,
    right: -10,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginLeft: -6,
    marginTop: -6,
  },
});
