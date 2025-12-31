
// lib/auth/authApi.ts
// A lightweight API client for login/register using fetch.
// Adjust BASE_URL and endpoints to match your backend.

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ;

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  token: string; // JWT or session token
  user: {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
  };
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, opts?: { status?: number; code?: string; details?: any }) {
    super(message);
    this.name = 'ApiError';
    this.status = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      // NOTE: Do NOT include 'credentials' for typical mobile JWT flow.
      // Add timeouts via AbortController if needed.
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      // Backend may return { message, code, errors } in JSON
      const message =
        (isJson && (data?.message || data?.error || data?.errors?.[0])) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(message, { status: res.status, details: data });
    }

    return data as T;
  } catch (err: any) {
    // Network errors, parsing errors, etc.
    if (err instanceof ApiError) throw err;
    throw new ApiError(err?.message ?? 'Network error', { details: err });
  }
}

/**
 * Login: POST /auth/login
 * Body: { email, password }
 * Response: { token, user }
 */
export async function loginApi(input: LoginInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Register: POST /auth/register
 * Body: { email, password, name? }
 * Response: { token, user }
 */
export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Optional: Get current user by token
 * GET /auth/me  with Authorization: Bearer <token>
 */
export async function meApi(token: string): Promise<AuthResponse['user']> {
  return request<AuthResponse['user']>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
