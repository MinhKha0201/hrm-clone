import { IBaseResponse, User } from '@/types/index.ts';

export interface Role extends IBaseResponse {
  name: string;
  no_user_with_role: number;
  description: string;
}
