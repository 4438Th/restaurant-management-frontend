import { apiClient, PageResponse } from '@repo/core';
import { DishCreateRequest, DishUpdateRequest, DishResponse } from '../menu.types';

export const dishesService = {
    getAll: (page = 1, size = 10, search?: string, status?: string) => {
        return apiClient.get<PageResponse<DishResponse>>('/menu/dishes', {
            params: { page, size, search, status },
        });
    },

    getTrash: (page = 1, size = 10, search?: string) => {
        return apiClient.get<PageResponse<DishResponse>>('/menu/dishes/trash', {
            params: { page, size, search },
        });
    },

    create: (payload: DishCreateRequest) => {
        return apiClient.post<DishResponse>('/menu/dishes', payload);
    },

    update: (id: string, payload: DishUpdateRequest) => {
        return apiClient.patch<DishResponse>(`/menu/dishes/${id}`, payload);
    },

    delete: (id: string) => {
        return apiClient.delete<string>(`/menu/dishes/${id}`);
    },

    restore: (id: string) => {
        return apiClient.post<string>(`/menu/dishes/${id}/restore`);
    },
};