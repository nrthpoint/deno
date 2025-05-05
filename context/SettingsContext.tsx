import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LengthUnit, UnitOfLength } from "@kingstinct/react-native-healthkit";

export type ActivityType = "runs" | "walks" | "cycles" | "sprints";
export type SpeedType = "time" | "pace";
export type TimeRange = "month" | "quarter" | "3_months" | "all_time";

interface SettingsContextType {
  unit: LengthUnit;
  activityType: ActivityType;
  speedType: SpeedType;
  timeRange: TimeRange;
  toggleUnit: () => void;
  setActivityType: (type: ActivityType) => void;
  setSpeedType: (type: SpeedType) => void;
  setTimeRange: (range: TimeRange) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [unit, setUnit] = useState<LengthUnit>(UnitOfLength.Miles);
  const [activityType, setActivityTypeState] = useState<ActivityType>("runs");
  const [speedType, setSpeedTypeState] = useState<SpeedType>("time");
  const [timeRange, setTimeRangeState] = useState<TimeRange>("month");

  useEffect(() => {
    AsyncStorage.multiGet([
      "distanceUnit",
      "activityType",
      "speedType",
      "timeRange",
    ]).then((values) => {
      const map = Object.fromEntries(values);

      if (
        map["distanceUnit"] === "km" ||
        map["distanceUnit"] === UnitOfLength.Miles
      ) {
        setUnit(map["distanceUnit"]);
      }

      if (map["activityType"])
        setActivityTypeState(map["activityType"] as ActivityType);
      if (map["speedType"]) setSpeedTypeState(map["speedType"] as SpeedType);
      if (map["timeRange"]) setTimeRangeState(map["timeRange"] as TimeRange);
    });
  }, []);

  const toggleUnit = () => {
    const next = unit === UnitOfLength.Miles ? "km" : UnitOfLength.Miles;
    setUnit(next);
    AsyncStorage.setItem("distanceUnit", next);
  };

  const setActivityType = (val: ActivityType) => {
    setActivityTypeState(val);
    AsyncStorage.setItem("activityType", val);
  };

  const setSpeedType = (val: SpeedType) => {
    setSpeedTypeState(val);
    AsyncStorage.setItem("speedType", val);
  };

  const setTimeRange = (val: TimeRange) => {
    setTimeRangeState(val);
    AsyncStorage.setItem("timeRange", val);
  };

  return (
    <SettingsContext.Provider
      value={{
        unit,
        activityType,
        speedType,
        timeRange,
        toggleUnit,
        setActivityType,
        setSpeedType,
        setTimeRange,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used inside SettingsProvider");
  return context;
};
