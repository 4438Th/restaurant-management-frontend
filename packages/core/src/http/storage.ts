// packages/core/src/http/storage.ts

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'restaurant_access_token',
    REFRESH_TOKEN: 'restaurant_refresh_token',
} as const;

export const tokenStorage = {
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    setToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    getRefreshToken: (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setRefreshToken: (token: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    clearToken: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
};