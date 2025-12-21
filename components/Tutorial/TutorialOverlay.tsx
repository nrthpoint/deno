import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Modal } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { useDimensionScaling } from './Debug/useDimensionScaling';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  position: 'top' | 'bottom' | 'center';
  showSkip?: boolean;
}

interface TutorialOverlayProps {
  visible: boolean;
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  visible,
  step,
  currentStepIndex,
  totalSteps,
  onNext,
  onSkip,
  onComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { scalePosition } = useDimensionScaling();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [visible, fadeAnim, slideAnim]);

  const isLastStep = currentStepIndex === totalSteps - 1;

  const renderHighlight = () => {
    if (!step.targetElement) return null;

    // Scale position from base dimensions to current screen size
    const scaledPosition = scalePosition(step.targetElement);
    const { x, y, width, height } = scaledPosition;
    const borderRadius = 12;
    const padding = 8;

    return (
      <View
        style={[
          styles.highlight,
          {
            left: x - padding,
            top: y - padding,
            width: width + padding * 2,
            height: height + padding * 2,
            borderRadius: borderRadius + padding,
          },
        ]}
      />
    );
  };

  const getContentPosition = () => {
    if (!step.targetElement) {
      return styles.contentCenter;
    }

    // Use scaled position for content positioning
    const scaledPosition = scalePosition(step.targetElement);
    const { y, height } = scaledPosition;
    const contentHeight = 200; // Approximate content height

    if (step.position === 'top' && y > contentHeight + 100) {
      return [styles.contentTop, { top: y - contentHeight - 100 }];
    } else if (step.position === 'bottom' && y + height + contentHeight < screenHeight - 100) {
      return [styles.contentBottom, { top: y + height + 50 }];
    } else {
      return styles.contentCenter;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <View style={styles.overlay}>
        {/* Dark overlay with cutout for highlighted element */}
        <View style={styles.darkOverlay} />

        {/* Highlight the target element */}
        {renderHighlight()}

        {/* Tutorial content */}
        <Animated.View
          style={[
            styles.content,
            getContentPosition(),
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.contentInner}>
            <Text style={styles.title}>{step.title}</Text>
            <Text style={styles.description}>{step.description}</Text>

            <View style={styles.actions}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {currentStepIndex + 1} of {totalSteps}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((currentStepIndex + 1) / totalSteps) * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.buttonContainer}>
                {step.showSkip !== false && (
                  <Button
                    mode="text"
                    onPress={onSkip}
                    textColor={colors.neutral}
                    style={styles.skipButton}
                  >
                    Skip Tutorial
                  </Button>
                )}
                <Button
                  mode="contained"
                  onPress={isLastStep ? onComplete : onNext}
                  buttonColor={colors.primary}
                  textColor="#fff"
                  style={styles.nextButton}
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                </Button>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'relative',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  contentCenter: {
    top: '50%',
    transform: [{ translateY: -100 }],
  },
  contentTop: {
    // Dynamic top position set inline
  },
  contentBottom: {
    // Dynamic top position set inline
  },
  contentInner: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.surfaceHighlight,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: LatoFonts.bold,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: LatoFonts.regular,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    gap: 16,
  },
  progressContainer: {
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.textSecondary,
  },
  progressBar: {
    width: 120,
    height: 4,
    backgroundColor: colors.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
    marginLeft: 12,
  },
});
