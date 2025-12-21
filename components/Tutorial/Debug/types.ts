import { TutorialStep } from '@/components/Tutorial/TutorialOverlay';

/**
 * Extended tutorial step with editable fields for debug mode
 */
export interface EditableTutorialStep extends TutorialStep {
  // Additional fields for debugging
  notes?: string;
}

/**
 * Debug state for tutorial editing
 */
export interface TutorialDebugState {
  isEnabled: boolean;
  currentStepIndex: number;
  steps: EditableTutorialStep[];
  isDragging: boolean;
  dragTarget: 'position' | 'size' | null;
}

/**
 * Actions for debug mode
 */
export interface TutorialDebugActions {
  updateStepText: (stepIndex: number, field: 'title' | 'description', value: string) => void;
  updateStepPosition: (
    stepIndex: number,
    position: { x: number; y: number; width: number; height: number },
  ) => void;
  updateStepMetadata: (
    stepIndex: number,
    field: 'position',
    value: 'top' | 'bottom' | 'center',
  ) => void;
  goToStep: (stepIndex: number) => void;
  exportSteps: () => void;
  importSteps: (steps: EditableTutorialStep[]) => void;
}
