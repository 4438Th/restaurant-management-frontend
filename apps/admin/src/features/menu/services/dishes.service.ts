import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    DishCreateRequest,
    DishUpdateRequest,
    DishResponse,
    DishAnalyticsResponse,
    DishFilterParams
} from '../menu.types';

export const dishesService = {
    getAll: (params: DishFilterParams) => {
        return apiClient.get<OffsetPageResponse<DishResponse>>('/menu/dishes', { params });
    },

    getTrash: (params: DishFilterParams) => {
        return apiClient.get<OffsetPageResponse<DishResponse>>('/menu/dishes/trash', { params });
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

    getAnalytics: () => {
        return apiClient.get<DishAnalyticsResponse>('/menu/dishes/analytics');
    },
};