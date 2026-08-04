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

export const isApiError = (error: unknown): error is ApiError => {
    return error instanceof ApiError;
};

let onTokenExpiredCallback: (() => void) | null = null;
export const setupHttpInterceptor = (onExpired: () => void) => {
    onTokenExpiredCallback = onExpired;
};

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
        // Trả về trực tiếp data.result đã qua bóc tách
        return response.data.result;
    },
    (error: AxiosError<ApiResponse<null>>) => {
        if (error.response) {
            const status = error.response.status;
            const apiData = error.response.data;
            const requestUrl = error.config?.url?.toLowerCase() ?? '';

            // Kiểm tra xem URL có phải là API Auth/Login hay không
            const isAuthRequest = requestUrl.includes('auth/login') || requestUrl.includes('auth/token');

            const isTokenExpired =
                (status === 401 ||
                    apiData?.code === 4102 ||
                    apiData?.message?.includes("TOKEN_EXPIRED")) &&
                !isAuthRequest;

            if (isTokenExpired) {
                if (typeof window !== 'undefined' && onTokenExpiredCallback) {
                    onTokenExpiredCallback();
                }
                return Promise.reject(
                    new ApiError('Phiên đăng nhập đã hết hạn.', 4102, 401)
                );
            }

            // Nếu là lỗi đăng nhập sai (401/400 từ /auth/login), văng lỗi ApiError bình thường
            return Promise.reject(
                new ApiError(
                    apiData?.message ?? 'Có lỗi xảy ra phía máy chủ!',
                    apiData?.code ?? status,
                    status
                )
            );
        }

        // 2. Lỗi Request - Không nhận được Response (Timeout hoặc Đứt Mạng)
        if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                return Promise.reject(
                    new ApiError('Yêu cầu quá thời gian phản hồi (Timeout 15s). Vui lòng thử lại!', 1002, 504)
                );
            }
            return Promise.reject(
                new ApiError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng!', 1001, 503)
            );
        }

        // 3. Lỗi Cú pháp / JS Runtime khác
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