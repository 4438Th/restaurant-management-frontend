import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ApiError, tokenStorage } from '@repo/core';
import { authService } from './auth.service';
import { LoginRequest, AuthenticationResponse } from './auth.types';

export const useLogin = () => {
    const router = useRouter();

    return useMutation<AuthenticationResponse, ApiError, LoginRequest>({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (authData) => {
            const token = authData?.token;

            if (token) {
                tokenStorage.setToken(token);
                setTimeout(() => {
                    router.push('/users');
                }, 300);
            }
        },
    });
};

export const useLogout = () => {
    const router = useRouter();

    return useMutation<void, ApiError, void>({
        mutationFn: async () => {
            const currentToken = tokenStorage.getToken();
            if (!currentToken) return;

            return authService.logout(currentToken, { timeout: 2000 });
        },
        retry: false,
        onSettled: () => {
            tokenStorage.clearToken();

            setTimeout(() => {
                router.push('/login');
            }, 300);
        },
    });
};