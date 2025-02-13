import { ZUtils } from '@/lib/validation.utils';
import { z } from 'zod';

export const BookARoomSchema = z.object({
  roomId: z.string(),
  date: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  start_time: z.string(),
  end_time: z.string(),
  location: z.string(),
  attendee_ids: z.array(z.string()),
  department: z.string().optional(),
  meetingAgenda: z.string(),
  meetingLink: ZUtils.url().optional(),
  group: z.string().optional(),
});
export type RequestBookARoomData = z.infer<typeof BookARoomSchema>;
