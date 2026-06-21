// packages/core/src/http/client.ts
import axios from 'axios';
import { tokenStorage } from './storage';
import { ApiResponse } from '../common/types';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000,
});

// Request Interceptor: Đính kèm token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
    (response) => {
        // response.data chính là ApiResponse<T> từ Spring Boot gửi về
        const apiResponse = response.data as ApiResponse<any>;

        // Trả trực tiếp phần dữ liệu bên trong .result ra ngoài tầng Service
        return apiResponse.result;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            const apiError = error.response.data as ApiResponse<null>; // Cục lỗi dạng ApiResponse từ BE

            // Xử lý khi Token hết hạn (Lỗi 401 hoặc mã lỗi Token Expired từ ErrorCode BE)
            if (status === 401 || apiError.code === 4102 || apiError.code === 4103) {
                if (typeof window !== 'undefined') {
                    tokenStorage.clearToken();
                    window.location.href = '/login';
                }
            }

            // Ném cục lỗi chuẩn của BE ra để Hook xử lý thông báo lỗi cụ thể
            return Promise.reject(apiError);
        }

        return Promise.reject({ code: 1001, message: 'Kết nối server thất bại!' });
    }
);