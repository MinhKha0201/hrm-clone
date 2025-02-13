import { TailwindColors } from '@/constants';
import { CalendarDate, DateFormatter, fromAbsolute } from '@internationalized/date';
import { DateTime } from 'luxon';

export const formatDateTime = (seconds: number, locale: string, timeZone: string): string => {
  const date = fromAbsolute(seconds * 1000, timeZone);

  const formatter = new DateFormatter(locale, {
    dateStyle: undefined,
    timeStyle: undefined,
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return formatter.format(date.toDate());
};

export const generateRandomPassword = (length: number = 10) => {
  const lettersAndNumbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const specialCharacters = '!@#$%^&*(),.?":{}|<>';
  let password = '';

  password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  for (let i = 1; i < length; i++) {
    const charSet = Math.random() < 0.2 ? specialCharacters : lettersAndNumbers;
    password += charSet[Math.floor(Math.random() * charSet.length)];
  }

  password = password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');

  return password;
};

export const generateRandomId = (length: number = 10) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const formatISOStringToString = (date: string) => {
  return new DateFormatter('vi-VN', {
    dateStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(date));
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: Record<string, any>, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export const createAPIEndpoint = (key: string, ...args: string[]) => {
  return format(key, ...args);
};

export const ISOStringToDateValue = (date: string, timeZone: string = 'America/New_York'): CalendarDate => {
  const localeDateString = new Date(date).toLocaleDateString('vi-VN', { timeZone });
  const temp = localeDateString.split('/');

  return new CalendarDate(parseInt(temp[2]), parseInt(temp[1]), parseInt(temp[0]));
};

export const format = (str: string, ...args: any[]): string => {
  let i = 0;
  return str.replace(/%[sdj%]/g, (match) => {
    if (match === '%%') {
      return '%';
    }
    const arg = args[i++];
    switch (match) {
      case '%s':
        return String(arg);
      case '%d':
        return Number(arg).toString();
      case '%j':
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Circular]';
        }
      default:
        return '';
    }
  });
};

export const getFirstAndLastDayOfMonth = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return {
    firstDay: formatDate(firstDay),
    lastDay: formatDate(lastDay),
  };
};

export const createISOString = (dateStr: string, timeStr: string) => {
  const combined = `${dateStr}T${timeStr}:00`;
  const date = new Date(combined);
  return date.toISOString();
};

export const compareTime = (time1: string, time2: string) => {
  const date1 = new Date(`2025-01-01T${time1}:00Z`);
  const date2 = new Date(`2025-01-01T${time2}:00Z`);

  if (date1 < date2) {
    return false;
  }
  return true;
};

export const getRandomTailwindColor = () => {
  const randomIndex = Math.floor(Math.random() * TailwindColors.length);
  return TailwindColors[randomIndex];
};

export const getLocalTime = (date: string) => {
  const d = new Date(date); //

  const hours = d.getHours();
  const minutes = d.getMinutes();

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const getLocalTimeFromISOString = (ISOString: string) => {
  const date = new Date(ISOString);

  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const getWeekStartAndEnd = (date = DateTime.now()) => {
  const firstDayOfWeek = date.startOf('week').plus({ days: 0 });
  const lastDayOfWeek = date.endOf('week').plus({ days: 0 });

  return {
    firstDayOfWeek: firstDayOfWeek.toISODate(),
    lastDayOfWeek: lastDayOfWeek.toISODate(),
  };
};
