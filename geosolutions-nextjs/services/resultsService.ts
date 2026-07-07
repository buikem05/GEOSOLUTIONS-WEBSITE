// services/resultsService.ts — Results API calls (framework-agnostic)

import api from './api';
import type { Result } from '@/types/results';
import type { ApiResponse } from '@/types/api';

export const resultsService = {
  async getMyResults(): Promise<Result[]> {
    const res = await api.get<ApiResponse<Result[]>>('/api/results/mine');
    return res.data ?? [];
  },

  async getAllResults(): Promise<Result[]> {
    const res = await api.get<ApiResponse<Result[]>>('/api/results');
    return res.data ?? [];
  },

  async getResultsByStudent(studentId: string): Promise<Result[]> {
    const res = await api.get<ApiResponse<Result[]>>(`/api/results/${studentId}`);
    return res.data ?? [];
  },

  async addResult(payload: Partial<Result>): Promise<Result> {
    const res = await api.post<ApiResponse<Result>>('/api/results', payload);
    if (!res.status || !res.data) throw new Error(res.message ?? 'Failed to add result.');
    return res.data;
  },
};
