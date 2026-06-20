import { apiFetch } from "../http";
import type { Permission } from "./types";
import type {
    ApiResponse,
    PageResponse
} from "../common";

export const permissionService = {
    getAll(page = 1, size = 10) {
        return apiFetch<
            ApiResponse<PageResponse<Permission>>
        >(
            `/permissions?page=${page}&size=${size}`,
        );
    },

    getById(name: string) {
        return apiFetch<
            ApiResponse<Permission>
        >(`/permissions/${name}`);
    },
};