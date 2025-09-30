import React, { useState } from 'react';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

import { DeleteWorkout } from './DeleteWorkout';
import { DeletionInfoModal } from './DeletionInfoModal';

interface DeleteWorkoutWithModalProps {
  workout: ExtendedWorkout;
  iconSize?: number;
  iconColor?: string;
  onDelete?: () => void;
}

export const DeleteWorkoutWithModal: React.FC<DeleteWorkoutWithModalProps> = (props) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleShowDeletionInfo = () => {
    setShowInfoModal(true);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
  };

  return (
    <>
      <DeleteWorkout
        {...props}
        onShowDeletionInfo={handleShowDeletionInfo}
      />
      <DeletionInfoModal
        visible={showInfoModal}
        onClose={handleCloseInfoModal}
      />
    </>
  );
};
