import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { ConfirmAction } from '@/components/ConfirmAction/ConfirmAction';
import { colors } from '@/config/colors';
import { ANALYTICS_EVENTS } from '@/constants/analytics';
import { useWorkout } from '@/context/Workout';
import { canDeleteWorkout } from '@/services/workoutStorage';
import { ExtendedWorkout } from '@/types/ExtendedWorkout';
import { logError } from '@/utils/analytics';

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
  const posthog = usePostHog();
  const { deleteWorkout } = useWorkout();
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkCanDelete = async () => {
      try {
        const deletable = await canDeleteWorkout(workout.uuid);
        setCanDelete(deletable);
      } catch (error) {
        logError(posthog, error, {
          component: 'DeleteWorkout',
          action: 'checkCanDelete',
          workout_uuid: workout.uuid,
        });
        setCanDelete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCanDelete();
  }, [workout.uuid, posthog]);

  const handleDelete = async () => {
    try {
      await deleteWorkout(workout);
      posthog?.capture(ANALYTICS_EVENTS.WORKOUT_DELETED, {
        $screen_name: 'view_workout',
        workout_uuid: workout.uuid,
      });
      onDelete?.();
    } catch (error) {
      logError(posthog, error, {
        component: 'DeleteWorkout',
        action: 'handleDelete',
        workout_uuid: workout.uuid,
      });
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
