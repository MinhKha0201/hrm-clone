import { IBaseResponse, User } from '.';
import { Department } from './department.type';
import { Group } from './group.type';

export interface BookingMeetingRoom extends IBaseResponse {
  room: MeetingRoom;
  startDate: string;
  endDate: string;
  meetingAgenda: string;
  department: Department;
  requestBy: User;
  group: Group;
  attendees: User[];
  meetingLink: string;
}

export interface MeetingRoom extends IBaseResponse {
  name: string;
  location: string;
  status: string;
  seating: number;
  description: string;
  image_url?: string;
}
