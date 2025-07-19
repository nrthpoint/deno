import { Quantity } from "@kingstinct/react-native-healthkit";

export function metersToMiles(m: Quantity): Quantity {
  const newUnit = {
    ...m,
  };

  newUnit.unit = "mi";
  newUnit.quantity = m.quantity * 0.000621371; // Convert meters to miles

  return newUnit;
}

export function metersToKilometers(m: Quantity): Quantity {
  const newUnit = {
    ...m,
  };

  newUnit.unit = "km";
  newUnit.quantity = m.quantity / 1000; // Convert meters to kilometers

  return newUnit;
}
