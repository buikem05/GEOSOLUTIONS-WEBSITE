'use client';

// hooks/usePayments.ts — Hook for payment management (Paystack)

import { useState, useCallback } from 'react';
import { paymentService } from '@/services/paymentService';
import { useUIStore } from '@/store/uiStore';
import type { Payment, PaymentInitPayload } from '@/types/payment';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchMyPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getMyPayments();
      setPayments(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load payments';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchAllPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load all payments';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const initPayment = useCallback(async (payload: PaymentInitPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await paymentService.initPayment(payload);
      // Redirect to Paystack authorization URL
      if (typeof window !== 'undefined' && res.authorizationUrl) {
        window.location.href = res.authorizationUrl;
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    payments,
    loading,
    error,
    fetchMyPayments,
    fetchAllPayments,
    initPayment,
  };
}
