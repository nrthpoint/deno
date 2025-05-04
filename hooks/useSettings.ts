import { DistanceUnit } from "../constants/units";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useSettings = () => {
  const [unit, setUnit] = useState<DistanceUnit>(DistanceUnit.Miles);

  useEffect(() => {
    (async () => {
      const storedUnit = await AsyncStorage.getItem("distanceUnit");
      if (
        storedUnit === DistanceUnit.Miles ||
        storedUnit === DistanceUnit.Kilometers
      ) {
        setUnit(storedUnit);
      }
    })();
  }, []);

  const toggleUnit = async () => {
    const newUnit =
      unit === DistanceUnit.Miles
        ? DistanceUnit.Kilometers
        : DistanceUnit.Miles;
    await AsyncStorage.setItem("distanceUnit", newUnit);
    setUnit(newUnit);
  };

  return { unit, toggleUnit };
};
