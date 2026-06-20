import { tokenStorage } from "@repo/core";

export function isAuthenticated() {
    return !!tokenStorage.get();
}

export function logout() {
    tokenStorage.remove();
}