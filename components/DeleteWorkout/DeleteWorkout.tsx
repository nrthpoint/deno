import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { ConfirmAction } from '@/components/ConfirmAction/ConfirmAction';
import { colors } from '@/config/colors';
import { useWorkoutActions } from '@/hooks/useWorkoutSelectors';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface DeleteWorkoutProps {
  workout: ExtendedWorkout;
  iconSize?: number;
  iconColor?: string;
  onDelete?: () => void;
  deleteFunction?: (workout: ExtendedWorkout) => Promise<void>;
}

export const DeleteWorkout: React.FC<DeleteWorkoutProps> = ({
  workout,
  iconSize = 24,
  iconColor = colors.error,
  onDelete,
  deleteFunction,
}) => {
  const { deleteWorkout: contextDeleteWorkout } = useWorkoutActions();

  const handleDelete = async () => {
    try {
      const deleteFunc = deleteFunction || contextDeleteWorkout;
      await deleteFunc(workout);
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
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons
          name="trash-outline"
          size={iconSize}
          color={iconColor}
        />
      </TouchableOpacity>
    </ConfirmAction>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    padding: 8,
  },
});
