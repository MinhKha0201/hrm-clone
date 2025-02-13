import { IBaseResponse } from '.';
import { User } from './user';

export interface Group extends IBaseResponse {
  name: string;
  description: string;
  image_url: string;
  member_can_invite: boolean;
  owner: User;
  members: User[];
}

export interface CreateGroup {
  name: string;
  member_ids: string[];
}
