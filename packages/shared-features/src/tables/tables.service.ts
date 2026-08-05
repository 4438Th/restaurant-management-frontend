import { apiClient, OffsetPageResponse } from '@repo/core';
import {
    TableCreateRequest,
    TableUpdateRequest,
    TableResponse,
    TableAnalyticsResponse,
    TableFilterParams
} from './tables.types';

export const tablesService = {
    getAll: (params?: TableFilterParams) => {
        return apiClient.get<OffsetPageResponse<TableResponse>>('/tables', { params });
    },

    getTrash: (params?: TableFilterParams) => {
        return apiClient.get<OffsetPageResponse<TableResponse>>('/tables/trash', { params });
    },

    create: (payload: TableCreateRequest) => {
        return apiClient.post<TableResponse>('/tables', payload);
    },

    update: (id: string, payload: TableUpdateRequest) => {
        return apiClient.patch<TableResponse>(`/tables/${id}`, payload);
    },

    delete: (id: string) => {
        return apiClient.delete<string>(`/tables/${id}`);
    },

    restore: (id: string) => {
        return apiClient.post<string>(`/tables/${id}/restore`);
    },

    getAnalytics: () => {
        return apiClient.get<TableAnalyticsResponse>('/tables/analytics');
    },
};