// packages/core/src/auth/service.ts
import { apiClient } from '../http/client';
import { tokenStorage } from '../http/storage';
import { AuthenticationResponse, LoginRequest, RefreshTokenRequest } from './types';

export const coreAuthService = {
    login: async (payload: LoginRequest): Promise<AuthenticationResponse> => {
        const data = await apiClient.post<AuthenticationResponse>('/auth/login', payload);

        if (data?.token) {
            tokenStorage.setToken(data.token);
        }
        return data;
    },

    refreshToken: async (): Promise<AuthenticationResponse> => {
        const currentToken = tokenStorage.getToken();
        if (!currentToken) throw new Error('No token found to refresh');

        const payload: RefreshTokenRequest = { token: currentToken };
        const data = await apiClient.post<AuthenticationResponse>('/auth/refreshToken', payload);

        if (data?.token) {
            tokenStorage.setToken(data.token);
        }
        return data;
    },

    logout: async (): Promise<void> => {
        const currentToken = tokenStorage.getToken();
        if (currentToken) {
            try {
                await apiClient.post('/auth/logout', { token: currentToken });
            } catch (e) {
                console.error('Logout on backend failed', e);
            }
        }
        tokenStorage.clearToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
};