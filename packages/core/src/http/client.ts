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

// Hàm helper đọc biến môi trường an toàn trên cả Vite, Next.js và Node.js
const getEnvVariable = (key: string): string | undefined => {
    // 1. Kiểm tra môi trường Vite (Sử dụng safe-evaluation để tránh lỗi CommonJS/TS compile)
    try {
        const meta = new Function('return import.meta')();
        if (meta && meta.env) {
            const viteVal = meta.env[key] || meta.env[`VITE_${key}`];
            if (viteVal) return viteVal;
        }
    } catch {
        // Bỏ qua nếu môi trường không hỗ trợ import.meta
    }

    // 2. Kiểm tra window.env (Injection runtime)
    if (typeof window !== 'undefined' && (window as any).env) {
        const windowVal = (window as any).env[key];
        if (windowVal) return windowVal;
    }

    // 3. Kiểm tra process.env (Node.js / Next.js)
    if (typeof process !== 'undefined' && process.env) {
        const processVal = process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
        if (processVal) return processVal;
    }

    return undefined;
};

const createBaseClient = (): AxiosInstance => {
    const getBaseURL = (): string => {
        const apiUrl = getEnvVariable('API_URL') || getEnvVariable('NEXT_PUBLIC_API_URL');
        return apiUrl || 'http://localhost:8080/api/v1';
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

        // Lỗi Request - Không nhận được Response (Timeout hoặc Đứt Mạng)
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

        // Lỗi Cú pháp / JS Runtime khác
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