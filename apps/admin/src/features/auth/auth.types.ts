// apps/admin/src/features/auth/auth.types.ts

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface AuthenticationResponse {
    token: string;
    authenticated: boolean;
}
