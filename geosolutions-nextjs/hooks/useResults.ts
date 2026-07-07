'use client';

// hooks/useResults.ts — Hook for student & teacher results management

import { useState, useCallback } from 'react';
import { resultsService } from '@/services/resultsService';
import { useUIStore } from '@/store/uiStore';
import type { Result } from '@/types/results';

export function useResults() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useUIStore();

  const fetchMyResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resultsService.getMyResults();
      setResults(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load results';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchAllResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resultsService.getAllResults();
      setResults(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load all results';
      setError(msg);
      showToast(msg, 'error');
      return [];
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const addResult = useCallback(async (payload: Partial<Result>) => {
    setLoading(true);
    setError(null);
    try {
      const newRes = await resultsService.addResult(payload);
      setResults((prev) => [newRes, ...prev]);
      showToast('Result added successfully!', 'success');
      return newRes;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add result';
      setError(msg);
      showToast(msg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    results,
    loading,
    error,
    fetchMyResults,
    fetchAllResults,
    addResult,
  };
}
