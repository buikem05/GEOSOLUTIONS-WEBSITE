import { z } from 'zod';
import { UserStatus, Role } from '@prisma/client';

export const ListUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  search: z.string().optional(),
});

export type ListUsersQuery = z.infer<typeof ListUsersQuerySchema>;

export const UpdateStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const UserParamsSchema = z.object({
  id: z.string().uuid(),
});
