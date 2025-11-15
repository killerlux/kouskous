// apps/admin/src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      // Try to refresh token
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken && originalRequest) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Update tokens
          useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const api = {
  // Auth
  verifyPhone: (phone: string) =>
    apiClient.post('/auth/verify-phone', { phone_e164: phone }),

  exchangeToken: (phone: string, otp: string) =>
    apiClient.post('/auth/exchange-token', { phone_e164: phone, otp_code: otp }),

  // User
  getMe: () => apiClient.get('/users/me'),

  // Deposits
  getPendingDeposits: (page = 1, limit = 20) =>
    apiClient.get('/admin/deposits', { params: { page, limit, status: 'pending' } }),

  getDeposit: (id: string) => apiClient.get(`/admin/deposits/${id}`),

  approveDeposit: (id: string, notes?: string) =>
    apiClient.post(`/admin/deposits/${id}/approve`, { notes }),

  rejectDeposit: (id: string, notes: string) =>
    apiClient.post(`/admin/deposits/${id}/reject`, { notes }),

  // Dashboard stats (placeholder)
  getDashboardStats: () =>
    apiClient.get('/admin/dashboard/stats'),
};

