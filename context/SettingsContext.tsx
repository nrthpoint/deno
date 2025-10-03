import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { TimeRange } from '@/config/timeRanges';

interface SettingsContextType {
  distanceUnit: LengthUnit;
  activityType: WorkoutActivityType;
  timeRangeInDays: TimeRange;
  setDistanceUnit: (unit: LengthUnit) => void;
  setActivityType: (type: WorkoutActivityType) => void;
  setTimeRange: (range: TimeRange) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [distanceUnit, setDistanceUnitState] = useState<LengthUnit>('mi'); // Default to miles
  const [activityType, setActivityTypeState] = useState<WorkoutActivityType>(
    WorkoutActivityType.running,
  );
  const [timeRangeInDays, setTimeRangeState] = useState<TimeRange>(30); // Default to 1 month

  useEffect(() => {
    AsyncStorage.multiGet(['distanceUnit', 'activityType', 'timeRange']).then((values) => {
      const storedConfig = Object.fromEntries(values);

      if (storedConfig['distanceUnit']) {
        const storedUnit = storedConfig['distanceUnit'] as LengthUnit;
        setDistanceUnitState(storedUnit);
      }

      if (storedConfig['activityType']) {
        const activityTypeValue = storedConfig['activityType'] as unknown as WorkoutActivityType;
        setActivityTypeState(activityTypeValue);
      }

      if (storedConfig['timeRange']) {
        const timeRangeValue = parseInt(storedConfig['timeRange'] as string);
        setTimeRangeState(timeRangeValue as TimeRange);
      }
    });
  }, []);

  const setDistanceUnit = (val: LengthUnit) => {
    setDistanceUnitState(val);

    AsyncStorage.setItem('distanceUnit', val);
  };

  const setActivityType = (val: WorkoutActivityType) => {
    setActivityTypeState(val);

    // Convert enum value to string for AsyncStorage
    AsyncStorage.setItem('activityType', String(val));
  };

  const setTimeRange = (val: TimeRange) => {
    setTimeRangeState(val);

    AsyncStorage.setItem('timeRange', val.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        distanceUnit,
        activityType,
        timeRangeInDays,
        setDistanceUnit,
        setActivityType,
        setTimeRange,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used inside SettingsProvider');
  return context;
};
