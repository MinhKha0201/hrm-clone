import * as z from 'zod';

export const RequestDaysOffSchema = z.object({
  requestTypeId: z.string().min(1),
  reason: z.string().min(1),
  detailReason: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  approverId: z.string(),
  supervisorId: z.string(),
  status: z.string().optional(),
  message: z.string().optional(),
  // duration: z.number().min(0).default(0),
});

export type RequestDaysOffData = z.infer<typeof RequestDaysOffSchema>;
