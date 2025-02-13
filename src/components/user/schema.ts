import { ZUtils } from '@/lib/validation.utils';
import * as z from 'zod';

export const userSchema = z.object({
  displayName: z.string(),
  password: ZUtils.password().optional(),
  gender: z.number(),
  roleId: z.string(),
  email: ZUtils.email(),
});

export const createUserSchema = userSchema.extend({
  displayName: z.string().min(1),
  password: ZUtils.password().min(6).optional(),
  roleId: z.string(),
  email: ZUtils.email(),
});

export const updateUserSchema = userSchema.partial();

export type CreateUserData = z.infer<typeof createUserSchema>;
export type UpdateUserData = z.infer<typeof updateUserSchema>;
