"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { userService } from "@repo/core";

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            userService.delete(id),

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