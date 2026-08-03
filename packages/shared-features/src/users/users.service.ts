import { apiClient, OffsetPageResponse } from '@repo/core';
import { UserResponse, UserCreateRequest, UserUpdateRequest, UserFilterParams } from './users.types';

export const usersService = {
    getAll: (params: UserFilterParams) => {
        return apiClient.get<OffsetPageResponse<UserResponse>>('/users', { params });
    },

    getTrash: (params: UserFilterParams) => {
        return apiClient.get<OffsetPageResponse<UserResponse>>('/users/trash', { params });
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
        return apiClient.post<string>(`/users/${id}/restore`);
    },
};