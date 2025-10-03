import {
  AuthorizationRequestStatus,
  subscribeToChanges,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit';
import { useEffect } from 'react';

import { SampleTypesToRead, SampleTypesToWrite } from '@/config/sampleIdentifiers';
import { FetchWorkoutsFunction } from '@/context/Workout/types';

export function useWorkoutSubscription(fetchWorkouts: FetchWorkoutsFunction) {
  const [_authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    SampleTypesToRead,
    SampleTypesToWrite,
  );

  useEffect(() => {
    if (_authorizationStatus !== AuthorizationRequestStatus.unnecessary) return;

    subscribeToChanges('HKWorkoutTypeIdentifier', () => {
      console.log('useWorkoutSubscription: Workout data changed, fetching workouts...');

      fetchWorkouts();
    });
  }, [requestAuthorization, fetchWorkouts, _authorizationStatus]);
}
