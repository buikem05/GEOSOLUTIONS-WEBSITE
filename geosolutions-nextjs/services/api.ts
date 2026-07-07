// services/api.ts — Framework-agnostic fetch-based API client
// Uses native fetch (works in Next.js client/server, Node.js, and React Native).
// No Axios dependency — avoids Node.js-only adapter issues in Turbopack.

const getBaseUrl = () => {
  // Client side → relative URL (Next.js proxy routes handle the actual API call)
  if (typeof window !== 'undefined') return '';
  // Server side → Express directly
  return process.env.EXPRESS_API_URL ?? 'http://localhost:3001/api';
};

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: 'include', // sends HttpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await res.json().catch(() => ({ status: false, message: res.statusText }));

  if (!res.ok) {
    throw new ApiError(json.message ?? 'Request failed.', res.status);
  }

  return json as T;
}

const api = {
  get: <T>(url: string, init?: RequestInit) =>
    request<T>(url, { method: 'GET', ...init }),

  post: <T>(url: string, body?: unknown, init?: RequestInit) =>
    request<T>(url, { method: 'POST', body: JSON.stringify(body), ...init }),

  patch: <T>(url: string, body?: unknown, init?: RequestInit) =>
    request<T>(url, { method: 'PATCH', body: JSON.stringify(body), ...init }),

  put: <T>(url: string, body?: unknown, init?: RequestInit) =>
    request<T>(url, { method: 'PUT', body: JSON.stringify(body), ...init }),

  delete: <T>(url: string, init?: RequestInit) =>
    request<T>(url, { method: 'DELETE', ...init }),
};

export default api;
