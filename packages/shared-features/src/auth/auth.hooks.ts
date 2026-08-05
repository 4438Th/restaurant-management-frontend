import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<AuthenticationResponse, ApiError, LoginRequest>({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (authData) => {
            const token = authData?.token;

            if (token) {
                // 1. Xóa toàn bộ cache cũ trước khi ghi nhận token mới
                queryClient.clear();

                // 2. Lưu token
                tokenStorage.setToken(token);

                // 3. Chuyển hướng
                setTimeout(() => {
                    router.push('/users');
                }, 300);
            }
        },
    });
};

export const useLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, void>({
        mutationFn: async () => {
            const currentToken = tokenStorage.getToken();
            if (!currentToken) return;

            return authService.logout(currentToken, { timeout: 2000 });
        },
        retry: false,
        onSettled: () => {
            // 1. Xóa token storage
            tokenStorage.clearToken();

            // 2. Xóa toàn bộ cache của TanStack Query để tránh đọng dữ liệu cũ
            queryClient.clear();

            // 3. Chuyển hướng về trang login
            setTimeout(() => {
                router.push('/login');
            }, 300);
        },
    });
};