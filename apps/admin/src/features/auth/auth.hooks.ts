// apps/admin/src/features/auth/auth.hooks.ts
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from './auth.service';
import { LoginRequest, AuthenticationResponse } from './auth.types';
import { tokenStorage } from '@repo/core';

export const useLogin = () => {
    const router = useRouter();

    return useMutation({

        mutationFn: (payload: LoginRequest) => authService.login(payload),
        onSuccess: (data: AuthenticationResponse) => {
            if (data && data.authenticated && data.token) {
                tokenStorage.setToken(data.token);
                router.push('/users');
            } else {
                alert("Tài khoản chưa được xác thực hệ thống!");
            }
        },
        onError: (error: any) => {
            alert(error?.message || "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!");
        }
    });
};

export const useLogout = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            const currentToken = tokenStorage.getToken();
            if (currentToken) {
                await authService.logout(currentToken).catch((e) => console.error("BE logout failed", e));
            }
        },
        onSuccess: () => {
            tokenStorage.clearToken();
            router.push('/login');
        }
    });
};