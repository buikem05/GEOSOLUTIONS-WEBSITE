// types/payment.ts — Payment types

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference: string;
  description: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentInitPayload {
  amount: number;
  description: string;
  email: string;
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}
