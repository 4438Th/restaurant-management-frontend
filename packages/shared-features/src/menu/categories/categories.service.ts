import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    MenuCategoryResponse,
    MenuCategoryCreateRequest,
    MenuCategoryUpdateRequest,
    MenuCategoryAnalyticsResponse,
    MenuCategoryFilterParams
} from './categories.types';

export const categoriesService = {

    getAll: (params: MenuCategoryFilterParams) => {
        return apiClient.get<OffsetPageResponse<MenuCategoryResponse>>('/menu/categories', { params });
    },


    getTrash: (params: MenuCategoryFilterParams) => {
        return apiClient.get<OffsetPageResponse<MenuCategoryResponse>>('/menu/categories/trash', { params });
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

    getAnalytics: () => {
        return apiClient.get<MenuCategoryAnalyticsResponse[]>('/menu/categories/analytics');
    },
};