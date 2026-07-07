import { z } from 'zod';

export const CreateResultSchema = z.object({
  studentId: z.string().uuid('Valid Student UUID is required'),
  subject: z.string().min(2, 'Subject name is required').max(100),
  score: z.coerce.number().min(0, 'Score cannot be less than 0').max(100, 'Score cannot exceed 100'),
  grade: z.string().max(5).optional(),
  term: z.string().min(2, 'Term is required').max(20),
  sessionYear: z.string().regex(/^\d{4}\/\d{4}$/, 'Session year must be in format YYYY/YYYY (e.g. 2024/2025)'),
});

export type CreateResultInput = z.infer<typeof CreateResultSchema>;

export const UpdateResultSchema = z.object({
  score: z.coerce.number().min(0).max(100).optional(),
  grade: z.string().max(5).optional(),
  term: z.string().max(20).optional(),
  sessionYear: z.string().regex(/^\d{4}\/\d{4}$/).optional(),
});

export type UpdateResultInput = z.infer<typeof UpdateResultSchema>;

export const ResultQuerySchema = z.object({
  studentId: z.string().uuid().optional(),
  subject: z.string().optional(),
  term: z.string().optional(),
  sessionYear: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ResultQuery = z.infer<typeof ResultQuerySchema>;
