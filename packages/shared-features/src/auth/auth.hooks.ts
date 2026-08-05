import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, tokenStorage } from '@repo/core';
import { authService } from './auth.service';
import { LoginRequest, AuthenticationResponse } from './auth.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const authKeys = {
    all: ['auth'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    profile: () => [...authKeys.all, 'profile'] as const,
};

// ==========================================
// HOOKS
// ==========================================

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation<AuthenticationResponse, ApiError, LoginRequest>({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (authData) => {
            const token = authData?.token;
            if (token) {
                queryClient.clear();
                tokenStorage.setToken(token);
            }
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, void>({
        mutationFn: async () => {
            const currentToken = tokenStorage.getToken();
            if (!currentToken) return;
            return authService.logout(currentToken, { timeout: 2000 });
        },
        retry: false,
        onSettled: () => {
            tokenStorage.clearToken();
            queryClient.clear();
        },
    });
};