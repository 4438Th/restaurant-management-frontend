import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError
} from 'axios';
import { tokenStorage } from './storage';
import { ApiResponse } from '../common/types';

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

const createBaseClient = (): AxiosInstance => {
    const getBaseURL = (): string => {
        if (typeof window !== 'undefined') {
            return (window as any).env?.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
        }
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    };

    return axios.create({
        baseURL: getBaseURL(),
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 15000,
    });
};

const instance = createBaseClient();


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


instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>): any => {
        return response.data.result;
    },
    (error: AxiosError<ApiResponse<null>>) => {
        if (error.response) {
            const status = error.response.status;
            const apiData = error.response.data;
            const requestUrl = error.config?.url ?? '';

            if ((status === 401 || apiData?.code === 4102) && !requestUrl.includes('/auth/login')) {
                if (typeof window !== 'undefined') {
                    tokenStorage.clearToken();
                    window.location.href = '/login';
                }
            }

            return Promise.reject(
                new ApiError(
                    apiData?.message ?? 'Có lỗi xảy ra phía máy chủ!',
                    apiData?.code ?? status,
                    status
                )
            );
        }
        if (error.request) {
            return Promise.reject(
                new ApiError('Kết nối tới server thất bại hoặc quá thời gian phản hồi!', 1001, 503)
            );
        }
        return Promise.reject(new ApiError(error.message, 1000, 500));
    }
);
export interface HttpClient {
    get<T = unknown>(url: string, config?: any): Promise<T>;
    post<T = unknown, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
    put<T = unknown, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
    patch<T = unknown, D = unknown>(url: string, data?: D, config?: any): Promise<T>;
    delete<T = unknown>(url: string, config?: any): Promise<T>;
}

export const apiClient = instance as unknown as HttpClient;