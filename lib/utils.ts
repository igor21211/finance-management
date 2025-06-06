import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  eachDayOfInterval,
  isSameDay,
  subDays,
  format,
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMiliUnits = (value: number) => {
  return Math.round(value * 100);
};

export const convertAmountFromMiliUnits = (value: number) => {
  return value / 100;
};

export const formatCurrency = (value: number, convert?: boolean) => {
  const finalValue = convert
    ? convertAmountFromMiliUnits(value)
    : value;
  return Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(finalValue);
};

export const calculatePercentageChange = (
  current: number,
  previous: number
) => {
  if (previous === 0 || previous === null) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
};

export const fillMissingDays = (
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) => {
  if (activeDays.length === 0) {
    return [];
  }
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
  return days.map((day) => {
    const activeDay = activeDays.find((activeDay) =>
      isSameDay(activeDay.date, day)
    );
    if (activeDay) {
      return activeDay;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      };
    }
  });
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);
  if (!period?.from) {
    return `${format(defaultFrom, 'LLL dd')} - ${format(defaultTo, 'LLL dd, y')}`;
  }
  if (period.to) {
    return `${format(period.from, 'LLL dd')} - ${format(
      period.to,
      'LLL dd, y'
    )}`;
  }

  return `${format(period.from, 'LLL dd, y')}`;
};

export const formatPercentage = (
  value: number,
  options: { addPrefix?: boolean } = { addPrefix: false }
) => {
  const result = new Intl.NumberFormat('uk-UA', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }
  return result;
};
