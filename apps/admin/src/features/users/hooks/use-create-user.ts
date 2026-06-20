"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import {
    userService,
    type CreateUserRequest,
} from "@repo/core";

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            payload: CreateUserRequest,
        ) => userService.create(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },
    });
}