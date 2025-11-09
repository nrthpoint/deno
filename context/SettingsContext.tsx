import { LengthUnit, WorkoutActivityType } from '@kingstinct/react-native-healthkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { TimeRange } from '@/config/timeRanges';

interface SettingsContextType {
  distanceUnit: LengthUnit;
  activityType: WorkoutActivityType;
  timeRangeInDays: TimeRange;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  advancedGroupingEnabled: boolean;
  setDistanceUnit: (unit: LengthUnit) => void;
  setActivityType: (type: WorkoutActivityType) => void;
  setTimeRange: (range: TimeRange) => void;
  setAge: (age: number | null) => void;
  setGender: (gender: 'Male' | 'Female' | 'Other' | null) => void;
  setAdvancedGroupingEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [distanceUnit, setDistanceUnitState] = useState<LengthUnit>('mi'); // Default to miles
  const [activityType, setActivityTypeState] = useState<WorkoutActivityType>(
    WorkoutActivityType.running,
  );
  const [timeRangeInDays, setTimeRangeState] = useState<TimeRange>(30); // Default to 1 month
  const [age, setAgeState] = useState<number | null>(null);
  const [gender, setGenderState] = useState<'Male' | 'Female' | 'Other' | null>(null);
  const [advancedGroupingEnabled, setAdvancedGroupingEnabledState] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.multiGet([
      'distanceUnit',
      'activityType',
      'timeRange',
      'age',
      'gender',
      'advancedGroupingEnabled',
    ]).then((values) => {
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

      if (storedConfig['age']) {
        const ageValue = parseInt(storedConfig['age'] as string);
        setAgeState(ageValue);
      }

      if (storedConfig['gender']) {
        const genderValue = storedConfig['gender'] as 'Male' | 'Female' | 'Other' | null;
        setGenderState(genderValue);
      }

      if (storedConfig['advancedGroupingEnabled']) {
        const advancedGroupingValue = storedConfig['advancedGroupingEnabled'] === 'true';
        setAdvancedGroupingEnabledState(advancedGroupingValue);
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

  const setAge = (val: number | null) => {
    setAgeState(val);

    if (val !== null) {
      AsyncStorage.setItem('age', val.toString());
    } else {
      AsyncStorage.removeItem('age');
    }
  };

  const setGender = (val: 'Male' | 'Female' | 'Other' | null) => {
    setGenderState(val);

    if (val !== null) {
      AsyncStorage.setItem('gender', val);
    } else {
      AsyncStorage.removeItem('gender');
    }
  };

  const setAdvancedGroupingEnabled = (val: boolean) => {
    setAdvancedGroupingEnabledState(val);
    AsyncStorage.setItem('advancedGroupingEnabled', val.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        distanceUnit,
        activityType,
        timeRangeInDays,
        age,
        gender,
        advancedGroupingEnabled,
        setDistanceUnit,
        setActivityType,
        setTimeRange,
        setAge,
        setGender,
        setAdvancedGroupingEnabled,
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
