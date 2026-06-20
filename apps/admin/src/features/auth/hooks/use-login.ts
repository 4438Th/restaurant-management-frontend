"use client";

import { useMutation } from "@tanstack/react-query";
import {
    authService,
    tokenStorage,
} from "@repo/core";

export function useLogin() {
    return useMutation({
        mutationFn: authService.login,

        onSuccess(data) {
            tokenStorage.set(
                data.result.token,
            );
        },
    });
}