"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { userService } from "@repo/core";

export function useRestoreUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            userService.restore(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            queryClient.invalidateQueries({
                queryKey: ["trash-users"],
            });
        },
    });
}