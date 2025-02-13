import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Ref } from 'vue';
import { CalendarDate, endOfMonth, fromDate, startOfMonth } from '@internationalized/date';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (time: string | number, isTime: boolean = true) => {
  const date = new Date(time);
  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-4);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);
  if (isTime) {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return `${year}-${month}-${day}`;
};

export const formatTime = (time: string | number | any): string => {
  const now = new Date().getTime();
  const diffTime = now - new Date(time).getTime();
  const seconds = diffTime / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const months = days / 30;
  const years = months / 12;

  if (seconds < 60) {
    return `${Math.floor(seconds)} ${Math.floor(seconds) === 1 ? 'second' : 'seconds'}`;
  } else if (minutes < 60) {
    return `${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? 'minute' : 'minutes'}`;
  } else if (hours < 24) {
    return `${Math.floor(hours)} ${Math.floor(hours) === 1 ? 'hour' : 'hours'}`;
  } else if (days < 30) {
    return `${Math.floor(days)}  ${Math.floor(days) === 1 ? 'day' : 'days'}`;
  } else if (months < 12) {
    return `${Math.floor(months)} ${Math.floor(months) === 1 ? 'month' : 'months'}`;
  }
  return `${Math.floor(years)} ${Math.floor(years) === 1 ? 'year' : 'years'}`;
};

export const valueUpdater = (updaterOrValue: any, ref: Ref) => {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
};

export const getCalendarDateFromDate = (value: number | string): CalendarDate => {
  const date = new Date(value);
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

export const getTimeFromCalendarDate = (rangeDate: { start: any; end: any }) => {
  const startDateTrans = rangeDate.start.set({
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const endDateTrans = rangeDate.end.set({
    hour: 23,
    minute: 59,
    second: 59,
    millisecond: 999,
  });
  return {
    start: startDateTrans.toDate().getTime(),
    end: endDateTrans.toDate().getTime(),
  };
};

export const dateRangeFilterFn = (row: any, columnId: any, filterValue: any) => {
  let rowValue = row.getValue(columnId);
  let [startDate, endDate] = filterValue;
  return rowValue >= Math.floor(startDate / 1000) && rowValue <= Math.floor(endDate / 1000);
};

export const getValueByKey = <T extends object, K extends keyof T>(Obj: T, key: K): T[K] => {
  return Obj[key];
};

export const copyProperties = <T extends object>(destination: T, source: Partial<T>) => {
  for (const key in source) {
    if (key in destination) {
      destination[key] = source[key]!;
    }
  }
};

export const getKeyFromValue = (obj: any, value: string): string | undefined => {
  const indexOf = Object.values(obj).indexOf(value);
  return Object.keys(obj)[indexOf];
};

export const Omit = <T extends object>(source: T, excludes: Extract<keyof T, string>[]) => {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => !excludes.includes(key as Extract<keyof T, string>))
  ) as Partial<T>;
};

export const Get = <T extends object>(source: T, includes: Extract<T, string>[]) => {
  return Object.fromEntries(
    Object.entries(source).filter(([key]) => includes.includes(key as Extract<T, string>))
  ) as Partial<T>;
};
