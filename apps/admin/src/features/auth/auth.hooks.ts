// apps/admin/src/features/auth/auth.hooks.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ApiError, tokenStorage } from '@repo/core';
import { authService } from './auth.service';
import { LoginRequest, AuthenticationResponse } from './auth.types';

export const useLogin = () => {
    const router = useRouter();
    return useMutation<AuthenticationResponse, ApiError, LoginRequest>({
        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (authData) => {
            if (authData && authData.authenticated && authData.token) {
                tokenStorage.setToken(authData.token);
                toast.success('Đăng nhập hệ thống thành công!');
                router.push('/users');
            }
        },
        onError: (error: ApiError) => {
            toast.error(
                error.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!'
            );
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
            toast.success("Đã đăng xuất khỏi hệ thống.");
            router.push("/login");
        }
    });
};