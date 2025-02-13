export * from './app.constant.ts';
export * from './list-request.constant.ts';

export const STORAGE_HOST = import.meta.env.VITE_STORAGE_HOST;
export const STORAGE_PATH = import.meta.env.VITE_STORAGE_PATH;

export const ROWS_PER_PAGE = [20, 50, 70, 120, 190];

export const ALERT_STYLE = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
};

export const ALERT_BUTTON = {
  success: 'Yes',
  error: 'Delete',
  warning: 'Yes',
  info: 'Confirm',
};

export const TailwindColors = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'pink',
  'teal',
  'cyan',
  'lime',
  'amber',
  'orange',
  'indigo',
  'emerald',
  'violet',
  'rose',
];
