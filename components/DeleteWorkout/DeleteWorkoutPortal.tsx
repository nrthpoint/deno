import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { ConfirmAction } from '@/components/ConfirmAction/ConfirmAction';
import { colors } from '@/config/colors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface DeleteWorkoutPortalProps {
  workout: ExtendedWorkout;
  iconSize?: number;
  iconColor?: string;
  onDelete?: () => void;
  deleteFunction: (workout: ExtendedWorkout) => Promise<void>;
}

export const DeleteWorkoutPortal: React.FC<DeleteWorkoutPortalProps> = ({
  workout,
  iconSize = 24,
  iconColor = colors.error,
  onDelete,
  deleteFunction,
}) => {
  const handleDelete = async () => {
    try {
      console.log('Deleting workout with id:', workout.uuid);
      await deleteFunction(workout);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  return (
    <ConfirmAction
      title="Delete Workout"
      message="Are you sure you want to delete this workout? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={handleDelete}
      destructive
    >
      <Ionicons
        name="trash-outline"
        size={iconSize}
        color={iconColor}
      />
    </ConfirmAction>
  );
};
