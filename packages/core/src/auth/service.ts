import { apiFetch } from "../http";
import type {
    LoginRequest,
    AuthenticationResponse,
} from "./types";

import type {
    ApiResponse,
} from "../common";

export const authService = {
    login(payload: LoginRequest) {
        return apiFetch<ApiResponse<AuthenticationResponse>>(
            "/auth/login",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    logout(token: string) {
        return apiFetch<ApiResponse<void>>(
            "/auth/logout",
            {
                method: "POST",
                body: JSON.stringify({ token }),
            },
        );
    },

    introspect(token: string) {
        return apiFetch<ApiResponse<{ valid: boolean }>>(
            "/auth/introspect",
            {
                method: "POST",
                body: JSON.stringify({ token }),
            },
        );
    },

    refreshToken(token: string) {
        return apiFetch<ApiResponse<AuthenticationResponse>>(
            "/auth/refreshToken",
            {
                method: "POST",
                body: JSON.stringify({ token }),
            },
        );
    },
};