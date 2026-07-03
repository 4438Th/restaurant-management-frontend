import { apiClient, PageResponse } from '@repo/core';
import { MenuItemCreateRequest, MenuItemUpdateRequest, MenuItemResponse } from '../menu.types';

export const itemsService = {
    getAll: (page = 1, size = 10, search?: string, status?: string) => {
        return apiClient.get<PageResponse<MenuItemResponse>>('/menu-items', {
            params: { page, size, search, status },
        });
    },

    getTrash: (page = 1, size = 10, search?: string) => {
        return apiClient.get<PageResponse<MenuItemResponse>>('/menu-items/trash', {
            params: { page, size, search },
        });
    },

    create: (payload: MenuItemCreateRequest) => {
        return apiClient.post<MenuItemResponse>('/menu-items', payload);
    },

    update: (id: string, payload: MenuItemUpdateRequest) => {
        return apiClient.patch<MenuItemResponse>(`/menu-items/${id}`, payload);
    },

    delete: (id: string) => {
        return apiClient.delete<string>(`/menu-items/${id}`);
    },

    restore: (id: string) => {
        return apiClient.post<string>(`/menu-items/${id}/restore`);
    },

};