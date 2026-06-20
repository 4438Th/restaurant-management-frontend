import { apiFetch } from "../http";

import type {
    ApiResponse,
    PageResponse,
} from "../common";

import type {
    User,
    CreateUserRequest,
    UpdateUserRequest,
    AssignRolesRequest,
    RemoveRolesRequest,
} from "./types";

export const userService = {
    getAll(
        page = 1,
        size = 10,
        search?: string,
        status?: string,
    ) {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("size", String(size));

        if (search) {
            params.append("search", search);
        }

        if (status) {
            params.append("status", status);
        }

        return apiFetch<ApiResponse<PageResponse<User>>>(
            `/users?${params.toString()}`,
        );
    },

    getTrash(page = 1, size = 10) {
        return apiFetch<
            ApiResponse<PageResponse<User>>
        >(`/users/trash?page=${page}&size=${size}`);
    },

    create(payload: CreateUserRequest) {
        return apiFetch<ApiResponse<User>>(
            "/users",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    update(
        id: string,
        payload: UpdateUserRequest,
    ) {
        return apiFetch<ApiResponse<User>>(
            `/users/${id}`,
            {
                method: "PATCH",
                body: JSON.stringify(payload),
            },
        );
    },

    delete(id: string) {
        return apiFetch<ApiResponse<string>>(
            `/users/${id}`,
            {
                method: "DELETE",
            },
        );
    },

    restore(id: string) {
        return apiFetch<ApiResponse<string>>(
            `/users/${id}`,
            {
                method: "POST",
            },
        );
    },

    activate(id: string) {
        return apiFetch<ApiResponse<User>>(
            `/users/${id}/activate`,
            {
                method: "PATCH",
            },
        );
    },

    block(id: string) {
        return apiFetch<ApiResponse<User>>(
            `/users/${id}/block`,
            {
                method: "PATCH",
            },
        );
    },

    assignRoles(
        payload: AssignRolesRequest,
    ) {
        return apiFetch<ApiResponse<User>>(
            "/users/assign-roles",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    removeRoles(
        payload: RemoveRolesRequest,
    ) {
        return apiFetch<ApiResponse<User>>(
            "/users/remove-roles",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },
};