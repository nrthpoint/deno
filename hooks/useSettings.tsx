import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LengthUnit, UnitOfLength } from "@kingstinct/react-native-healthkit";

interface SettingsContextType {
  unit: LengthUnit;
  toggleUnit: () => void;
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

  useEffect(() => {
    AsyncStorage.getItem("distanceUnit").then((value) => {
      if (value === "km" || value === UnitOfLength.Miles) {
        setUnit(value);
      }
    });
  }, []);

  const toggleUnit = () => {
    const next = unit === UnitOfLength.Miles ? "km" : UnitOfLength.Miles;
    setUnit(next);
    AsyncStorage.setItem("distanceUnit", next);
  };

  return (
    <SettingsContext.Provider value={{ unit, toggleUnit }}>
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
