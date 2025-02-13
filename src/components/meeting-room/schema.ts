import { z } from 'zod';

export const meetingRoomSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string(),
  seating: z.number(),
  status: z.string().optional(),
  image_url: z.string().optional(),
});

export type MeetingRoomData = z.infer<typeof meetingRoomSchema>;
