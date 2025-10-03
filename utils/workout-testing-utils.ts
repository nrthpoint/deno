import { Quantity } from '@kingstinct/react-native-healthkit';

import { ExtendedWorkout } from '@/types/ExtendedWorkout';

export const createMockWorkout = ({
  distance = 3,
  averagePace = 8,
  unit = 'mi',
}: {
  distance?: number;
  averagePace?: number;
  unit?: string;
}): ExtendedWorkout =>
  ({
    distance: { unit, quantity: distance } as Quantity,
    pace: averagePace
      ? ({ unit: 'min/mi', quantity: averagePace } as Quantity)
      : ({ unit: 'min/mi', quantity: 8 } as Quantity),
    daysAgo: '1 day ago',
    prettyPace: '8:00',
  }) as unknown as ExtendedWorkout;

export const createMockWorkoutWithoutPace = (): ExtendedWorkout =>
  ({
    distance: { unit: 'mi', quantity: 3 } as Quantity,
    pace: undefined,
    daysAgo: '1 day ago',
    prettyPace: '',
  }) as unknown as ExtendedWorkout;

export const createMockWorkoutWithoutDistance = (averagePace: number): ExtendedWorkout =>
  ({
    distance: undefined,
    pace: { unit: 'min/mi', quantity: averagePace } as Quantity,
    daysAgo: '1 day ago',
    prettyPace: `${Math.floor(averagePace)}:${Math.round((averagePace % 1) * 60)
      .toString()
      .padStart(2, '0')}`,
  }) as unknown as ExtendedWorkout;
