import { IBaseResponse, Role } from '@/types/index.ts';
import { Department } from './department.type';

// request
export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

// response
export interface User extends IBaseResponse {
  email: string;
  password: string;
  emailConfirmed: boolean;
  accessFailedCount: number;
  displayName: string;
  gender: number;
  lockoutEnabled: boolean;
  lockoutEnd: any;
  role: Role;
  department: Department;
}
