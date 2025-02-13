import { Component } from 'vue';
export * from './auth.ts';
export * from './user.ts';
export * from './role.ts';
export * from './request-days-off.ts';

export interface SideBarItem {
  id: string;
  name: string;
  path: string;
  icon?: Component;
  children?: SideBarItem[];
}

export type ComboboxFilterType = {
  label: string;
  value: string;
};

export interface IBaseResponse {
  _id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface BaseShop {
  _id: string;
  name: string;
}

export interface DateRange {
  from_date: string;
  to_date: string;
}

export interface IApiResponseV1<T> {
  status: boolean;
  statusCode: number;
  metadata: T;
}

export interface CalendarEvent {
  id: string;
  start: string;
  end: string;
  title: string;
  class: string;
  deletable?: boolean;
  resizable?: boolean;
  draggable?: boolean;
}
