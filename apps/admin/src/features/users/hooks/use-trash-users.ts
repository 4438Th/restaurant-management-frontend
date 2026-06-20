"use client";

import { useQuery } from "@tanstack/react-query";

import { userService } from "@repo/core";

export function useTrashUsers(
    page = 1,
    size = 10,
) {
    return useQuery({
        queryKey: [
            "trash-users",
            page,
            size,
        ],

        queryFn: () =>
            userService.getTrash(page, size),
    });
}