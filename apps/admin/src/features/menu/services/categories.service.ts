import { apiClient, PageResponse } from '@repo/core';
import { MenuCategoryResponse, MenuCategoryCreateRequest, MenuCategoryUpdateRequest } from '../menu.types';

export const categoriesService = {
    getAll: (page = 1, size = 10, search?: string, status?: string) => {
        return apiClient.get<PageResponse<MenuCategoryResponse>>('/menu/categories', {
            params: { page, size, search, status },
        });
    },

    getTrash: (page = 1, size = 10, search?: string) => {
        return apiClient.get<PageResponse<MenuCategoryResponse>>('/menu/categories/trash', {
            params: { page, size, search },
        });
    },

    create: (payload: MenuCategoryCreateRequest) => {
        return apiClient.post<MenuCategoryResponse>('/menu/categories', payload);
    },

    update: (id: string, payload: MenuCategoryUpdateRequest) => {
        return apiClient.patch<MenuCategoryResponse>(`/menu/categories/${id}`, payload);
    },

    delete: (id: string) => {
        return apiClient.delete<string>(`/menu/categories/${id}`);
    },

    restore: (id: string) => {
        return apiClient.post<string>(`/menu/categories/${id}/restore`);
    },

};