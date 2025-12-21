import * as Clipboard from 'expo-clipboard';
import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { TutorialStep } from '@/components/Tutorial/TutorialOverlay';

import { DraggableHighlight } from './DraggableHighlight';
import { TutorialDebugControls } from './TutorialDebugControls';
import { TutorialStepEditor } from './TutorialStepEditor';
import { EditableTutorialStep } from './types';
import { useDimensionScaling, ScaledPosition } from './useDimensionScaling';

interface TutorialDebuggerProps {
  visible: boolean;
  initialSteps: TutorialStep[];
  currentStepIndex: number;
  onClose: () => void;
  onStepChange: (index: number) => void;
}

/**
 * Tutorial Debugger - Interactive overlay for editing tutorial steps
 * Only available in development mode
 *
 * Features:
 * - Live editing of step text and positions
 * - Drag-and-drop highlight positioning
 * - Screen size-aware coordinate system
 * - Export edited steps to clipboard
 * - Navigate between steps in real-time
 */
export const TutorialDebugger: React.FC<TutorialDebuggerProps> = ({
  visible,
  initialSteps,
  currentStepIndex: externalStepIndex,
  onClose,
  onStepChange,
}) => {
  const [steps, setSteps] = useState<EditableTutorialStep[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(externalStepIndex);
  const { scalePosition, unscalePosition } = useDimensionScaling();

  // Sync with external step index
  React.useEffect(() => {
    setCurrentStepIndex(externalStepIndex);
  }, [externalStepIndex]);

  const currentStep = steps[currentStepIndex];

  const handleUpdateText = useCallback(
    (field: 'title' | 'description', value: string) => {
      setSteps((prev) => {
        const newSteps = [...prev];
        newSteps[currentStepIndex] = {
          ...newSteps[currentStepIndex],
          [field]: value,
        };
        return newSteps;
      });
    },
    [currentStepIndex],
  );

  const handleUpdatePosition = useCallback(
    (position: 'top' | 'bottom' | 'center') => {
      setSteps((prev) => {
        const newSteps = [...prev];
        newSteps[currentStepIndex] = {
          ...newSteps[currentStepIndex],
          position,
        };
        return newSteps;
      });
    },
    [currentStepIndex],
  );

  const handleHighlightPositionChange = useCallback(
    (scaledPosition: ScaledPosition) => {
      // Convert back to base dimensions for storage
      const basePosition = unscalePosition(scaledPosition);

      setSteps((prev) => {
        const newSteps = [...prev];
        newSteps[currentStepIndex] = {
          ...newSteps[currentStepIndex],
          targetElement: {
            x: Math.round(basePosition.x),
            y: Math.round(basePosition.y),
            width: Math.round(basePosition.width),
            height: Math.round(basePosition.height),
          },
        };
        return newSteps;
      });
    },
    [currentStepIndex, unscalePosition],
  );

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1;
      setCurrentStepIndex(newIndex);
      onStepChange(newIndex);
    }
  }, [currentStepIndex, onStepChange]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1;
      setCurrentStepIndex(newIndex);
      onStepChange(newIndex);
    }
  }, [currentStepIndex, steps.length, onStepChange]);

  const handleGoToStep = useCallback(
    (index: number) => {
      setCurrentStepIndex(index);
      onStepChange(index);
    },
    [onStepChange],
  );

  const handleExport = useCallback(async () => {
    try {
      const exportData = {
        steps: steps.map((step) => ({
          id: step.id,
          title: step.title,
          description: step.description,
          targetElement: step.targetElement,
          position: step.position,
          showSkip: step.showSkip,
        })),
        exportedAt: new Date().toISOString(),
        note: 'Tutorial steps exported from debug mode. Copy this to tutorialSteps.ts',
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      await Clipboard.setStringAsync(jsonString);

      Alert.alert(
        'Exported Successfully',
        'Tutorial steps have been copied to clipboard. Paste into tutorialSteps.ts to save your changes.',
        [{ text: 'OK' }],
      );
    } catch (_error) {
      Alert.alert('Export Failed', 'Could not copy to clipboard');
    }
  }, [steps]);

  if (!visible) return null;

  // Get scaled position for current screen
  const scaledPosition = currentStep.targetElement
    ? scalePosition(currentStep.targetElement)
    : null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Semi-transparent background */}
          <View style={styles.background} />

          {/* Draggable highlight */}
          {scaledPosition && (
            <DraggableHighlight
              position={scaledPosition}
              onPositionChange={handleHighlightPositionChange}
              isEditing
            />
          )}

          {/* Debug controls at the top */}
          <View style={styles.topControls}>
            <TutorialDebugControls
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onGoToStep={handleGoToStep}
              onExport={handleExport}
              onClose={onClose}
            />
          </View>

          {/* Step editor at the bottom */}
          <View style={styles.bottomEditor}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <TutorialStepEditor
                step={currentStep}
                stepIndex={currentStepIndex}
                onUpdateText={handleUpdateText}
                onUpdatePosition={handleUpdatePosition}
              />
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  topControls: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  bottomEditor: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    maxHeight: '40%',
    zIndex: 100,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
