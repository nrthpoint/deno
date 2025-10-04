import { QuantityWithFormat } from '@/utils/quantity';

import type { Quantity } from '@kingstinct/react-native-healthkit';
import type { ValueType } from 'react-native-nitro-modules';

interface CreateQuantityOptions {
  q?: ValueType | Quantity;
  defaultQuantity?: number;
  defaultUnit?: string;
  unitOverride?: string;
  formatter?: (value: number, unit: string) => string;
  quantityFormatter?: (value: number) => number;
}

export function createQuantityWithFormat({
  q,
  defaultQuantity = 0,
  defaultUnit = '',
  unitOverride,
  quantityFormatter,
  formatter,
}: CreateQuantityOptions): QuantityWithFormat {
  let quantity = defaultQuantity;
  let unit = defaultUnit;

  if (q && typeof q === 'object' && 'quantity' in q && 'unit' in q) {
    const maybeQuantity = q as unknown as Quantity;

    if (typeof maybeQuantity.quantity === 'number') {
      if (quantityFormatter) {
        quantity = quantityFormatter(maybeQuantity.quantity);
      } else {
        quantity = maybeQuantity.quantity;
      }
    }

    if (unitOverride) {
      unit = unitOverride;
    } else if (typeof maybeQuantity.unit === 'string') {
      unit = maybeQuantity.unit;
    } else {
      unit = defaultUnit;
    }
  }

  const formatted = formatter ? formatter(quantity, unit) : `${quantity}${unit}`;

  return { quantity, unit, formatted };
}

export function normalizeHumidity({ q }: { q?: ValueType }): QuantityWithFormat {
  return createQuantityWithFormat({
    q,
    defaultUnit: '%',
    formatter: (value) => `${value.toFixed(0)}%`,
  });
}

export function normalizeTemperatureC({ q }: { q?: ValueType }): QuantityWithFormat {
  return createQuantityWithFormat({
    q,
    defaultUnit: '°C',
    unitOverride: '°C', // converts degC to C
    formatter: (value) => `${value.toFixed(1)}°C`,
    quantityFormatter: (value) => Number(value.toFixed(1)), // ensure one decimal place
  });
}

export function normalizeElevationMeters({ q }: { q?: ValueType }): QuantityWithFormat {
  return createQuantityWithFormat({
    q,
    defaultUnit: 'm',
    formatter: (value) => `${value.toFixed(1)} m`,
  });
}

export function normalizeMETs({ q }: { q?: ValueType }): QuantityWithFormat {
  return createQuantityWithFormat({
    q,
    defaultUnit: 'METs',
    formatter: (value) => value.toFixed(1),
  });
}

export function normalizeGenericQuantity({
  q,
  unit = '',
}: {
  q?: ValueType | Quantity;
  unit?: string;
}): QuantityWithFormat {
  return createQuantityWithFormat({
    q,
    defaultUnit: unit,
    formatter: (value) => `${value.toFixed(1)} ${unit}`,
  });
}
