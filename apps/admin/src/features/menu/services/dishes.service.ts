import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    DishCreateRequest,
    DishUpdateRequest,
    DishResponse,
    DishAnalyticsResponse,
    DishFilterParams // Sử dụng Type Filter đã đồng bộ từ cấu trúc DTO Backend
} from '../menu.types';

export const dishesService = {
    // ĐỒNG BỘ: Sử dụng OffsetPageResponse và object params gộp
    getAll: (params: DishFilterParams) => {
        return apiClient.get<OffsetPageResponse<DishResponse>>('/menu/dishes', { params });
    },

    // ĐỒNG BỘ: Dùng chung cấu trúc filter cho cả phần thùng rác
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