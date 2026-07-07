import { z } from 'zod';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';

export const CreatePaymentSchema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  paymentMethod: z.string().default('Paystack'),
  reference: z.string().min(5, 'Unique transaction reference is required'),
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export const VerifyPaymentSchema = z.object({
  reference: z.string().min(5),
  status: z.nativeEnum(PaymentStatus).default(PaymentStatus.success),
  gatewayResponse: z.string().optional(),
});

export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

export const CreateSubscriptionSchema = z.object({
  studentId: z.string().uuid(),
  durationDays: z.coerce.number().int().positive().default(30),
  status: z.nativeEnum(SubscriptionStatus).default(SubscriptionStatus.active),
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
