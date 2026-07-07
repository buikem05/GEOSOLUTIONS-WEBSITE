// services/paymentService.ts — Payment API calls (framework-agnostic)
// Portable to React Native

import api from './api';
import type { Payment, PaymentInitPayload, PaymentInitResponse } from '@/types/payment';
import type { ApiResponse } from '@/types/api';

export const paymentService = {
  async getMyPayments(): Promise<Payment[]> {
    const data = await api.get<ApiResponse<Payment[]>>('/api/payments/mine');
    return data.data ?? [];
  },

  async getAllPayments(): Promise<Payment[]> {
    const data = await api.get<ApiResponse<Payment[]>>('/api/payments');
    return data.data ?? [];
  },

  async initPayment(payload: PaymentInitPayload): Promise<PaymentInitResponse> {
    const data = await api.post<ApiResponse<PaymentInitResponse>>('/api/payments/init', payload);
    if (!data.status || !data.data) {
      throw new Error(data.message ?? 'Failed to initialize payment.');
    }
    return data.data;
  },

  async verifyPayment(reference: string): Promise<Payment> {
    const data = await api.get<ApiResponse<Payment>>(`/api/payments/verify/${reference}`);
    if (!data.status || !data.data) {
      throw new Error(data.message ?? 'Payment verification failed.');
    }
    return data.data;
  },
};
