import { tokenStorage } from "./storage";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8080";

export async function apiFetch<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? tokenStorage.get()
            : null;

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),
                ...options?.headers,
            },
        },
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}