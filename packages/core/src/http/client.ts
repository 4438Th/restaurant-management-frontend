import axios, {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError
} from 'axios';
import { tokenStorage } from './storage';
import { ApiResponse } from '../common/types';

// MAP CONSTANT ERROR CODE TỪ BACKEND
export const BE_ERROR_CODES = {
    // Auth & Token
    AUTH_ACCESS_UNAUTHENTICATED: 4001,
    AUTH_ACCESS_UNAUTHORIZED: 4002,
    TOKEN_PAYLOAD_INVALID: 4101,
    TOKEN_ACCESS_EXPIRED: 4102,
    TOKEN_REFRESH_EXPIRED: 4103,
} as const;

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

const getEnvVariable = (key: string): string | undefined => {
    try {
        const meta = new Function('return import.meta')();
        if (meta && meta.env) {
            const viteVal = meta.env[key] || meta.env[`VITE_${key}`];
            if (viteVal) return viteVal;
        }
    } catch { }

    if (typeof window !== 'undefined' && (window as any).env) {
        const windowVal = (window as any).env[key];
        if (windowVal) return windowVal;
    }

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

// Queue xử lý refresh token đồng thời
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 1. REQUEST INTERCEPTOR
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

// 2. RESPONSE INTERCEPTOR
instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse<unknown>>): any => {
        return response.data?.result !== undefined ? response.data.result : response.data;
    },
    async (error: AxiosError<ApiResponse<null>>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response) {
            const status = error.response.status;
            const apiData = error.response.data;
            const errorCode = apiData?.code;
            const requestUrl = originalRequest?.url?.toLowerCase() ?? '';

            const isAuthRequest =
                requestUrl.includes('auth/login') ||
                requestUrl.includes('auth/refresh-token') ||
                requestUrl.includes('auth/token');

            // ĐIỀU KIỆN REFRESH TOKEN: Status 401 HOẶC BE trả về ErrorCode 4102 (TOKEN_ACCESS_EXPIRED)
            const shouldAttemptRefresh =
                (status === 401 || errorCode === BE_ERROR_CODES.TOKEN_ACCESS_EXPIRED) &&
                !isAuthRequest;

            if (shouldAttemptRefresh && originalRequest && !originalRequest._retry) {
                // Nếu 1 request khác đang refresh, đẩy request này vào queue chờ
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            return instance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                const currentToken = tokenStorage.getToken();

                // Trường hợp 1: Không có token trong localStorage (Chưa đăng nhập)
                if (!currentToken) {
                    isRefreshing = false;
                    return Promise.reject(
                        new ApiError(
                            apiData?.message ?? 'Yêu cầu xác thực tài khoản.',
                            BE_ERROR_CODES.AUTH_ACCESS_UNAUTHENTICATED,
                            401
                        )
                    );
                }

                // Trường hợp 2: Có Token cũ nhưng hết hạn -> Gọi Refresh Token
                try {
                    const refreshResponse = await axios.post<
                        ApiResponse<{
                            token: string;
                            authenticated: boolean;
                            expiryTime: string;
                        }>
                    >(
                        `${instance.defaults.baseURL}/auth/refresh-token`,
                        { token: currentToken }
                    );

                    const newToken = refreshResponse.data?.result?.token;

                    if (!newToken) {
                        throw new Error("Không lấy được token mới từ API Refresh");
                    }

                    // Lưu Access Token mới
                    tokenStorage.setToken(newToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }

                    processQueue(null, newToken);
                    return instance(originalRequest);
                } catch (refreshErr: any) {
                    // Xử lý khi Refresh Token THẤT BẠI (Do Refresh Token cũng hết hạn - ErrorCode 4103)
                    processQueue(refreshErr, null);
                    tokenStorage.clearToken();

                    // CHỈ BẬT MODAL ĐĂNG NHẬP KHI THỰC SỰ REFRESH THẤT BẠI
                    if (typeof window !== 'undefined' && onTokenExpiredCallback) {
                        onTokenExpiredCallback();
                    }

                    return Promise.reject(
                        new ApiError(
                            'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.',
                            BE_ERROR_CODES.TOKEN_REFRESH_EXPIRED,
                            401
                        )
                    );
                } finally {
                    isRefreshing = false;
                }
            }

            // Trả về ApiError chuẩn hóa với đúng ErrorCode và Message từ Backend
            return Promise.reject(
                new ApiError(
                    apiData?.message ?? 'Có lỗi xảy ra phía máy chủ!',
                    errorCode ?? status,
                    status
                )
            );
        }

        // Lỗi mạng / Network Timeout
        if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                return Promise.reject(
                    new ApiError('Yêu cầu quá thời gian phản hồi (Timeout 15s). Vui lòng thử lại!', 1002, 504)
                );
            }
            return Promise.reject(
                new ApiError('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng!', 1005, 503)
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