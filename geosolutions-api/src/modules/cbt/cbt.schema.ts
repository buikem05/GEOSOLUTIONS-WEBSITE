import { z } from 'zod';

export const StartExamSchema = z.object({
  subject: z.string().min(2, 'Subject is required').max(100),
  durationMinutes: z.coerce.number().int().positive().default(45),
});

export type StartExamInput = z.infer<typeof StartExamSchema>;

export const SubmitExamSchema = z.object({
  sessionId: z.string().uuid(),
  answers: z.record(z.string(), z.string()), // questionId -> selectedOption
  telemetry: z.record(z.string(), z.unknown()).optional(),
});

export type SubmitExamInput = z.infer<typeof SubmitExamSchema>;

export const ProctorAnalyzeSchema = z.object({
  sessionId: z.string().uuid(),
  telemetry: z.record(z.string(), z.unknown()),
});

export type ProctorAnalyzeInput = z.infer<typeof ProctorAnalyzeSchema>;
