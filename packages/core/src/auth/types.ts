export interface LoginRequest {
    username: string;
    password: string;
}

export interface AuthenticationResponse {
    token: string;
    authenticated: boolean;
    expiryTime: string;
}

export interface IntrospectRequest {
    token: string;
}

export interface IntrospectResponse {
    valid: boolean;
}

export interface LogoutRequest {
    token: string;
}

export interface RefreshTokenRequest {
    token: string;
}