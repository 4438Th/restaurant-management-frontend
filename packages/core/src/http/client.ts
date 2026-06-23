// packages/core/src/http/client.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { tokenStorage } from './storage';
import { ApiResponse } from '../common/types';

// ApiError
export class ApiError extends Error {
    readonly code: number;
    readonly statusCode: number;

    constructor(message: string, code: number, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

// Định nghĩa lại hàm của AxiosInstance
declare module 'axios' {
    export interface AxiosInstance {
        get<T = unknown, D = unknown>(url: string, config?: import('axios').AxiosRequestConfig<D>): Promise<T>;
        post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: import('axios').AxiosRequestConfig<D>): Promise<R>;
        put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: import('axios').AxiosRequestConfig<D>): Promise<R>;
        patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: import('axios').AxiosRequestConfig<D>): Promise<R>;
        delete<T = unknown, D = unknown>(url: string, config?: import('axios').AxiosRequestConfig<D>): Promise<T>;
    }
}

// Khởi tạo AxiosInstance
const instance: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request Interceptor: gắn token vào header Authorization
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (typeof window !== 'undefined') {
            const token = tokenStorage.getToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: unknown) => Promise.reject(error)
);

// 4. Response Interceptor: chuẩn hóa dữ liệu trả về và xử lý lỗi
instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>): any => {
        return response.data.result;
    },
    (error: AxiosError<ApiResponse<null>>) => {
        // Lỗi phản hồi từ BE (400, 401, 403, 500...)
        if (error.response) {
            const status = error.response.status;
            const apiData = error.response.data;
            const requestUrl = error.config?.url ?? '';

            if ((status === 401 || apiData?.code === 4102) && !requestUrl.includes('/auth/login')) {
                // xử lý logout...
            }

            return Promise.reject(
                new ApiError(
                    apiData?.message ?? 'Có lỗi xảy ra phía máy chủ!',
                    apiData?.code ?? status,
                    status
                )
            );
        }

        // Lỗi server không có phản hồi (Network Error)
        if (error.request) {
            return Promise.reject(
                new ApiError('Kết nối tới server thất bại hoặc quá thời gian phản hồi!', 1001, 503)
            );
        }

        // Lỗi khởi tạo hoặc crash client
        return Promise.reject(new ApiError(error.message, 1000, 500));
    }
);

export const apiClient = instance;