// types/api.ts — Generic API response wrappers

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  status: false;
  message: string;
}
