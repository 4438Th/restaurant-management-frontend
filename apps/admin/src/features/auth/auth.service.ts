// apps/admin/src/features/auth/auth.service.ts
import { apiClient } from '@repo/core';
import { LoginRequest, AuthenticationResponse } from './auth.types';

export const authService = {
    login: (payload: LoginRequest): Promise<AuthenticationResponse> => {
        return apiClient.post<AuthenticationResponse>('/auth/login', payload);
    },

    refreshToken: (token: string): Promise<AuthenticationResponse> => {
        return apiClient.post<AuthenticationResponse>('/auth/refreshToken', { token });
    },

    logout: (token: string): Promise<void> => {
        return apiClient.post<void>('/auth/logout', { token });
    }
};