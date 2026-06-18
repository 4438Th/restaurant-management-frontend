import { httpClient } from './http-client';
import { ApiResponse, TokenInfo } from '@/types/api';
import { LoginRequest } from '@/types/auth';

export const authApi = {
    login: (data: LoginRequest) => {
        return httpClient.post<ApiResponse<TokenInfo>>('/auth/login', data);
    }
};