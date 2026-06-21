// packages/core/src/http/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { tokenStorage } from './storage';
import { ApiResponse } from '../common/types';

// Định nghĩa lại cấu trúc của một Custom Instance đã được unwrap data hoàn toàn
interface CustomAxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request Interceptor
instance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = tokenStorage.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Tự động bóc tách .result từ ApiResponse<T>
instance.interceptors.response.use(
    (response) => {
        const apiResponse = response.data as ApiResponse<any>;
        return apiResponse.result;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const apiError = error.response.data as ApiResponse<null>;

            if (status === 401 || apiError.code === 4102 || apiError.code === 4103) {
                if (typeof window !== 'undefined') {
                    tokenStorage.clearToken();
                    window.location.href = '/login';
                }
            }
            return Promise.reject(apiError);
        }
        return Promise.reject({ code: 1001, message: 'Kết nối server thất bại!' });
    }
);

// Ép kiểu instance thành CustomAxiosInstance đã loại bỏ lớp vỏ bọc AxiosResponse
export const apiClient = instance as unknown as CustomAxiosInstance;