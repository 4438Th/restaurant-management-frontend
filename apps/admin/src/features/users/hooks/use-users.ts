"use client";

import { useQuery } from "@tanstack/react-query";

import { userService } from "@repo/core";

export function useUsers(
    page = 1,
    size = 10,
    search?: string,
    status?: string,
) {
    return useQuery({
        queryKey: [
            "users",
            page,
            size,
            search,
            status,
        ],

        queryFn: () =>
            userService.getAll(
                page,
                size,
                search,
                status,
            ),
    });
}