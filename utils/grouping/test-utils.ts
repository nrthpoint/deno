import { ExtendedWorkout } from '@/types/workout';
import { Quantity } from '@kingstinct/react-native-healthkit';

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
    totalDistance: { unit, quantity: distance } as Quantity,
    averagePace: averagePace
      ? ({ unit: 'min/mi', quantity: averagePace } as Quantity)
      : ({ unit: 'min/mi', quantity: 8 } as Quantity),
    daysAgo: '1 day ago',
    prettyPace: '8:00',
  }) as unknown as ExtendedWorkout;

export const createMockWorkoutWithoutPace = (): ExtendedWorkout =>
  ({
    totalDistance: { unit: 'mi', quantity: 3 } as Quantity,
    averagePace: undefined,
    daysAgo: '1 day ago',
    prettyPace: '',
  }) as unknown as ExtendedWorkout;

export const createMockWorkoutWithoutDistance = (averagePace: number): ExtendedWorkout =>
  ({
    totalDistance: undefined,
    averagePace: { unit: 'min/mi', quantity: averagePace } as Quantity,
    daysAgo: '1 day ago',
    prettyPace: `${Math.floor(averagePace)}:${Math.round((averagePace % 1) * 60)
      .toString()
      .padStart(2, '0')}`,
  }) as unknown as ExtendedWorkout;
