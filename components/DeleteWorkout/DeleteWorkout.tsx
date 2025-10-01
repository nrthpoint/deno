import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ConfirmAction } from '@/components/ConfirmAction/ConfirmAction';
import { colors } from '@/config/colors';
import { useWorkout } from '@/context/Workout';
import { canDeleteWorkout } from '@/services/workoutStorage';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';

interface DeleteWorkoutProps {
  workout: ExtendedWorkout;
  iconSize?: number;
  iconColor?: string;
  onDelete?: () => void;
  onShowDeletionInfo?: () => void;
}

export const DeleteWorkout: React.FC<DeleteWorkoutProps> = ({
  workout,
  iconSize = 24,
  iconColor = colors.error,
  onDelete,
  onShowDeletionInfo,
}) => {
  const { deleteWorkout } = useWorkout();
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkCanDelete = async () => {
      try {
        const deletable = await canDeleteWorkout(workout.uuid);
        setCanDelete(deletable);
      } catch (error) {
        console.error('Error checking if workout can be deleted:', error);
        setCanDelete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCanDelete();
  }, [workout.uuid]);

  const handleDelete = async () => {
    try {
      await deleteWorkout(workout);
      onDelete?.();
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const handleInfoPress = () => {
    onShowDeletionInfo?.();
  };

  if (isLoading) {
    return (
      <Ionicons
        name="trash-outline"
        size={iconSize}
        color={colors.gray}
      />
    );
  }

  if (canDelete) {
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
  }

  return (
    <TouchableOpacity
      onPress={handleInfoPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name="trash-outline"
        size={iconSize}
        color={colors.gray}
      />
    </TouchableOpacity>
  );
};
