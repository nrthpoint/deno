import { WorkoutActivityType } from '@kingstinct/react-native-healthkit';

export const getActivityIcon = (activityType: WorkoutActivityType) => {
  switch (activityType) {
    case WorkoutActivityType.running:
      return 'run';
    case WorkoutActivityType.walking:
      return 'walk';
    case WorkoutActivityType.cycling:
      return 'bike';
    default:
      return 'run';
  }
};
