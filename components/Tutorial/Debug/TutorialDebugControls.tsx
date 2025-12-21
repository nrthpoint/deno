import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';

import { colors } from '@/config/colors';
import { LatoFonts } from '@/config/fonts';

interface TutorialDebugControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToStep: (index: number) => void;
  onExport: () => void;
  onClose: () => void;
}

export const TutorialDebugControls: React.FC<TutorialDebugControlsProps> = ({
  currentStepIndex,
  totalSteps,
  onPrevious,
  onNext,
  onGoToStep,
  onExport,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tutorial Debugger</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => setIsMinimized(!isMinimized)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isMinimized ? 'chevron-down' : 'chevron-up'}
              size={24}
              color={colors.neutral}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={styles.iconButton}
          >
            <Ionicons
              name="close"
              size={24}
              color={colors.neutral}
            />
          </TouchableOpacity>
        </View>
      </View>

      {!isMinimized && (
        <>
          <View style={styles.navigation}>
            <TouchableOpacity
              onPress={onPrevious}
              disabled={currentStepIndex === 0}
              style={[styles.navButton, currentStepIndex === 0 && styles.navButtonDisabled]}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={currentStepIndex === 0 ? colors.lightGray : colors.neutral}
              />
            </TouchableOpacity>

            <Text style={styles.stepCounter}>
              Step {currentStepIndex + 1} / {totalSteps}
            </Text>

            <TouchableOpacity
              onPress={onNext}
              disabled={currentStepIndex === totalSteps - 1}
              style={[
                styles.navButton,
                currentStepIndex === totalSteps - 1 && styles.navButtonDisabled,
              ]}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={currentStepIndex === totalSteps - 1 ? colors.lightGray : colors.neutral}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.stepList}
            contentContainerStyle={styles.stepListContent}
          >
            {Array.from({ length: totalSteps }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onGoToStep(index)}
                style={[styles.stepDot, index === currentStepIndex && styles.stepDotActive]}
              >
                <Text
                  style={[
                    styles.stepDotText,
                    index === currentStepIndex && styles.stepDotTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={onExport}
              buttonColor={colors.primary}
              textColor="#fff"
              icon="download"
              style={styles.exportButton}
            >
              Export to Clipboard
            </Button>
          </View>
        </>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: LatoFonts.bold,
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  stepCounter: {
    fontSize: 16,
    fontFamily: LatoFonts.bold,
    color: colors.neutral,
  },
  stepList: {
    maxHeight: 60,
  },
  stepListContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepDotText: {
    fontSize: 12,
    fontFamily: LatoFonts.bold,
    color: colors.lightGray,
  },
  stepDotTextActive: {
    color: '#fff',
  },
  actions: {
    marginTop: 8,
  },
  exportButton: {
    borderRadius: 8,
  },
});
