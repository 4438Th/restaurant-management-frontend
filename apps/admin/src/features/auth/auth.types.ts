// apps/admin/src/features/auth/auth.types.ts

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface AuthenticationResponse {
    token: string; // Chuỗi JWT nhận từ BE
    authenticated: boolean;
}

export interface IntrospectRequest {
    token: string;
}

export interface IntrospectResponse {
    valid: boolean;
}

export interface RefreshTokenRequest {
    token: string;
}