import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, saveToken, clearToken } from "./storage"; // adjust path
import { BASE_URL } from "./env";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;


export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // 🔥 needed for refresh cookie
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    // console.log('Attaching token to request:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log('Response error intercepted:', error);
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
          isRefreshing = false;
        });
      }

      try {
        await refreshPromise;
        return api(originalRequest); // 🔁 retry request
      } catch (refreshError) {
        await clearToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   res => res,
//   (error) => {
//     if (!error.response) {
//       console.log("🚨 Network Error:", {
//         message: error.message,
//         config: error.config,
//       });
//     } else {
//       console.log("❌ API Error:", {
//         status: error.response.status,
//         data: error.response.data,
//       });
//     }
//     return Promise.reject(error);
//   }
// );


async function refreshAccessToken() {
  const res = await axios.post(
    `${BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true }
  );
  // console.log('Refreshing access token...in RAT and response:', res.data);

  await saveToken(res.data.accessToken);
}
