/**
 * Tutorial Debug Mode
 *
 * This module provides interactive debugging tools for tutorial development.
 * It is only included in development builds and automatically stripped in production.
 *
 * Usage:
 * Import and conditionally render based on __DEV__ flag:
 *
 * ```tsx
 * if (__DEV__) {
 *   const { TutorialDebugger } = require('@/components/Tutorial/Debug');
 *   // Use TutorialDebugger component
 * }
 * ```
 */

export { TutorialDebugger } from './TutorialDebugger';
export { TutorialStepEditor } from './TutorialStepEditor';
export { TutorialDebugControls } from './TutorialDebugControls';
export { DraggableHighlight } from './DraggableHighlight';
export { useDimensionScaling } from './useDimensionScaling';
export type { EditableTutorialStep, TutorialDebugState, TutorialDebugActions } from './types';
export type { ScaledPosition } from './useDimensionScaling';
