import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

import { EditableTutorialStep } from './types';

interface TutorialStepEditorProps {
  step: EditableTutorialStep;
  stepIndex: number;
  onUpdateText: (field: 'title' | 'description', value: string) => void;
  onUpdatePosition: (position: 'top' | 'bottom' | 'center') => void;
}

export const TutorialStepEditor: React.FC<TutorialStepEditorProps> = ({
  step,
  stepIndex,
  onUpdateText,
  onUpdatePosition,
}) => {
  const [title, setTitle] = useState(step.title);
  const [description, setDescription] = useState(step.description);

  // Sync local state when step changes
  useEffect(() => {
    setTitle(step.title);
    setDescription(step.description);
  }, [step.title, step.description, stepIndex]);

  const handleTitleBlur = () => {
    if (title !== step.title) {
      onUpdateText('title', title);
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== step.description) {
      onUpdateText('description', description);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Step {stepIndex + 1}</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          onBlur={handleTitleBlur}
          placeholder="Step title"
          placeholderTextColor={colors.lightGray}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          onBlur={handleDescriptionBlur}
          placeholder="Step description"
          placeholderTextColor={colors.lightGray}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Content Position</Text>
        <View style={styles.positionButtons}>
          {(['top', 'center', 'bottom'] as const).map((pos) => (
            <TouchableOpacity
              key={pos}
              style={[styles.positionButton, step.position === pos && styles.positionButtonActive]}
              onPress={() => onUpdatePosition(pos)}
            >
              <Text
                style={[
                  styles.positionButtonText,
                  step.position === pos && styles.positionButtonTextActive,
                ]}
              >
                {pos}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {step.targetElement && (
        <View style={styles.coordinates}>
          <Text style={styles.coordinatesLabel}>Highlight Position (Base Dimensions)</Text>
          <Text style={styles.coordinatesText}>
            X: {Math.round(step.targetElement.x)}, Y: {Math.round(step.targetElement.y)}
          </Text>
          <Text style={styles.coordinatesText}>
            W: {Math.round(step.targetElement.width)}, H: {Math.round(step.targetElement.height)}
          </Text>
          <Text style={styles.hint}>Drag the highlight box to adjust position</Text>
        </View>
      )}

      <Button
        mode="outlined"
        onPress={() => Keyboard.dismiss()}
        textColor={colors.neutral}
        style={styles.dismissButton}
      >
        Dismiss Keyboard
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  header: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.primary,
    marginBottom: 8,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: LatoFonts.regular,
    color: colors.neutral,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  positionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  positionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.lightGray,
    alignItems: 'center',
  },
  positionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  positionButtonText: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    textTransform: 'capitalize',
  },
  positionButtonTextActive: {
    color: '#fff',
  },
  coordinates: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  coordinatesLabel: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    fontFamily: LatoFonts.regular,
    color: colors.lightGray,
  },
  hint: {
    fontSize: 11,
    fontFamily: LatoFonts.regular,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  dismissButton: {
    borderColor: colors.lightGray,
    borderRadius: 8,
  },
});
