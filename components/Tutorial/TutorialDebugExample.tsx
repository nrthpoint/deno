/**
 * Example integration of Tutorial Debug Mode
 *
 * This file shows how to integrate the debug overlay into your app.
 * Copy this pattern into your main screen component.
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { colors } from '@/config/colors';
import { useTutorialContext } from '@/context/TutorialContext';

import { TutorialOverlay } from './TutorialOverlay';
import { tutorialSteps } from './tutorialSteps';
import { useTutorialDebug } from './useTutorialDebug';

export const TutorialDebugExample: React.FC = () => {
  const tutorial = useTutorialContext();
  const { isDebugEnabled } = useTutorialDebug();
  const [showDebugger, setShowDebugger] = useState(false);

  // Conditionally import debug component (automatically tree-shaken in production)
  let TutorialDebugger: any = null;
  if (__DEV__) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    TutorialDebugger = require('./Debug').TutorialDebugger;
  }

  const handleStepChange = (newIndex: number) => {
    // You can implement logic here to sync with tutorial context
    // For now, just logging
    console.log('Debug mode: Step changed to', newIndex);
  };

  return (
    <View style={styles.container}>
      {/* Your app content goes here */}

      {/* Regular Tutorial Overlay */}
      <TutorialOverlay
        visible={tutorial.isVisible && !showDebugger}
        step={tutorial.currentStep}
        currentStepIndex={tutorial.currentStepIndex}
        totalSteps={tutorial.totalSteps}
        onNext={tutorial.nextStep}
        onSkip={tutorial.skipTutorial}
        onComplete={tutorial.completeTutorial}
      />

      {/* Debug Overlay (only in dev mode when enabled) */}
      {__DEV__ && isDebugEnabled && TutorialDebugger && (
        <>
          <TutorialDebugger
            visible={showDebugger}
            initialSteps={tutorialSteps}
            currentStepIndex={tutorial.currentStepIndex}
            onClose={() => setShowDebugger(false)}
            onStepChange={handleStepChange}
          />

          {/* Floating debug toggle button */}
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => setShowDebugger(!showDebugger)}
          >
            <Text style={styles.debugButtonText}>{showDebugger ? '✕' : '🐛'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
  },
  debugButtonText: {
    fontSize: 24,
  },
});
