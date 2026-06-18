import 'axios';
import { ApiResponse } from './api';

declare module 'axios' {
    export interface AxiosInstance {
        // Ép kiểu lại cho hàm GET
        get<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

        // Ép kiểu lại cho hàm POST
        post<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;

        // Ép kiểu lại cho hàm PUT
        put<T = any, R = T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;

        // Ép kiểu lại cho hàm DELETE
        delete<T = any, R = T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
    }
}