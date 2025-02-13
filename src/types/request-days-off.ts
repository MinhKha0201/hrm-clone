import { IBaseResponse, User } from '@/types';

export interface RequestDaysOff extends IBaseResponse {
  requestType: RequestType;
  reason: string;
  detailReason: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: STATUS;
  creator: User;
  approver: User & { acceptAt: string | null; rejectAt: string | null; message?: string };
  supervisor: User & { acceptAt: string | null; rejectAt: string | null; message?: string };
}

export type STATUS = 'APPROVED' | 'PENDING' | 'REJECTED' | 'CANCELLED';

export interface RequestType extends IBaseResponse {
  name: string;
  description: string;
  code: string;
  isPaid: boolean;
  unit: string;
  requireApproval: boolean;
  requireAttachment: boolean;
  maxAllowed: number;
  standardDays: number;
  reasons: Reason[];
}

export interface Reason {
  _id: string;
  reason: string;
  frequencyOfUse: number;
}

export interface Prepare {
  approver: User[];
  supervisor: User[];
}

export interface RequestDayOffOverview {
  late_arrival_and_early_departure_count: number;
  vacation_count: number;
  pending_request_count: number;
  received_request_count: number;
}
