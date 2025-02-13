import { IBaseResponse } from '.';
import { User } from './user';

export interface Department extends IBaseResponse {
  code: string;
  name: string;
  description: string;
  leaders: User[];
  members: string[];
  isLeader: boolean;
}
