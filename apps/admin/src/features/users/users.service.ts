// apps/admin/src/features/users/users.service.ts
import { apiClient, PageResponse, UserResponse } from '@repo/core';
import { UserCreateRequest, UserUpdateRequest, AssignRolesRequest } from './users.types';

export const usersService = {
    getAll: (page = 1, size = 10, search?: string, status?: string) => {
        return apiClient.get<PageResponse<UserResponse>>('/users', {
            params: { page, size, search, status },
        });
    },

    getTrash: (page = 1, size = 10, search?: string) => {
        return apiClient.get<PageResponse<UserResponse>>('/users/trash', {
            params: { page, size, search },
        });
    },

    create: (payload: UserCreateRequest) => {
        return apiClient.post<UserResponse>('/users', payload);
    },

    update: (id: string, payload: UserUpdateRequest) => {
        return apiClient.patch<UserResponse>(`/users/${id}`, payload);
    },

    delete: (id: string) => {
        return apiClient.delete<string>(`/users/${id}`);
    },

    restore: (id: string) => {
        return apiClient.post<string>(`/users/${id}`);
    },

    activate: (id: string) => {
        return apiClient.patch<UserResponse>(`/users/${id}/activate`);
    },

    block: (id: string) => {
        return apiClient.patch<UserResponse>(`/users/${id}/block`);
    },

    assignRoles: (payload: AssignRolesRequest) => {
        return apiClient.post<UserResponse>('/users/assign-roles', payload);
    }
};