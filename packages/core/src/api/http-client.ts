import axios from 'axios';
import { ErrorCode } from '@/constants/error-codes';
import { ApiResponse, TokenInfo } from '@/types/api';

export const httpClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});


httpClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});


httpClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;
        const apiError = error.response?.data;

        if (apiError?.code === ErrorCode.TOKEN_EXPIRED && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');

                const res = await axios.post<ApiResponse<TokenInfo>>(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/refresh`,
                    { token: refreshToken }
                );

                const newAccessToken = res.result.tokenValue;
                localStorage.setItem('access_token', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return httpClient(originalRequest);
            } catch (refreshError) {
                localStorage.clear();
                if (typeof window !== 'undefined') window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(apiError || error);
    }
);