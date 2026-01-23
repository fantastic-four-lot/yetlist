
// // lib/auth/authApi.ts
// A lightweight API client for login/register using fetch.
// Adjust BASE_URL and endpoints to match your backend.

// export const BASE_URL = 'http://192.168.200.182:3000'
export const BASE_URL = 'http://172.20.1.115:3000'
// export const BASE_URL = "http://localhost:3000"


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
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    // [key: string]: any;
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

// async function request<T>(path: string, options: RequestInit): Promise<T> {
//   const url = `${BASE_URL}${path}`;
//     // console.log('API Request:', { url, options });

//   try {
//     const res = await fetch(url, {
//       // NOTE: Do NOT include 'credentials' for typical mobile JWT flow.
//       // Add timeouts via AbortController if needed.
//       ...options,
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers ?? {}),
//       },
//       // credentials: "include"
//     });

//     const isJson = res.headers.get('content-type')?.includes('application/json');
//     const data = isJson ? await res.json() : await res.text();

//     if (!res.ok) {
//       // Backend may return { message, code, errors } in JSON
//       const message =
//         (isJson && (data?.message || data?.error || data?.errors?.[0])) ||
//         `Request failed with status ${res.status}`;

        

//         console.log('API Request error:', { status: data });
//       throw new ApiError(message, { status: res.status, details: data });
//     }

//     // console.log('API Response:', data);
//     return data as T;
//   } catch (err: any) {
//     // Network errors, parsing errors, etc.
//     // console.error('API Request error:', err);
    
//     if (err instanceof ApiError) throw err;
//     throw new ApiError(err?.message ?? 'Network error', { details: err });
//   }
// }

// /**
//  * Login: POST /auth/login
//  * Body: { email, password }
//  * Response: { token, user }
//  */
// export async function loginApi(input: LoginInput): Promise<AuthResponse> {
//     // console.log('loginApi called', input);
//   return request<AuthResponse>('/auth/login', {
//     method: 'POST',
//     body: JSON.stringify(input),
//   });
  
// }

// /**
//  * Register: POST /auth/register
//  * Body: { email, password, name? }
//  * Response: { token, user }
//  */
// export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
//   return request<AuthResponse>('/auth/signup', {
//     method: 'POST',
//     body: JSON.stringify(input),
//   });
// }

// export async function meApi(token:string): Promise<AuthResponse['user']> {
//   return request<AuthResponse['user']>('/auth/me', {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
// export async function checkRefreshToken(): Promise<AuthResponse> {
//   return request<AuthResponse>('/auth/refresh', {
//     method: 'POST',
//     credentials: 'include',
//   });
// }

//   export async function logoutApi(): Promise<{ message: string }> {
//     return request<{ message: string }>('/auth/logout', {
//       method: 'POST',
//       credentials: 'include',
//     });
  
// }

import { api } from "./api";
import { saveToken, clearToken } from "./storage";

export async function loginApi(input: LoginInput) {
  // console.log('loginApi called', input);
  const res = await api.post<AuthResponse>("/auth/login", input);
  // console.log('loginApi response:', res.data);
  await saveToken(res.data.accessToken);
  return res.data;
}

export async function registerApi(input: RegisterInput) {
  const res = await api.post<AuthResponse>("/auth/signup", input);
  // await saveToken(res.data.accessToken);
  return res.data;
}

export async function meApi() {
  const res = await api.get<AuthResponse['user']>("/auth/me");
  return res.data;
}

export async function logoutApi() {
  const res = await api.post("/auth/logout");
  await clearToken();
  return res.data;
}

export async function checkRefreshToken() {
  const res = await api.post("/auth/refresh");
  return res.data;  
}

