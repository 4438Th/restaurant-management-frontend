import { apiFetch } from "../http";
import type { Role } from "./types";
import type {
    ApiResponse,
    PageResponse
} from "../common";

export const roleService = {
    getAll(page = 1, size = 10) {
        return apiFetch<
            ApiResponse<PageResponse<Role>>
        >(
            `/roles?page=${page}&size=${size}`,
        );
    },

    getById(name: string) {
        return apiFetch<ApiResponse<Role>>(
            `/roles/${name}`,
        );
    },
};