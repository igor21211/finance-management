import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMiliUnits = (value: number) => {
  return Math.round(value * 100);
};

export const convertAmountFromMiliUnits = (value: number) => {
  return value / 100;
};

export const formatCurrency = (value: number) => {
  const finalValue = convertAmountFromMiliUnits(value);
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(finalValue);
};
