import { apiClient, CursorPageResponse } from '@repo/core';
import {
    TableReservationCreateRequest,
    TableReservationUpdateRequest,
    TableReservationCancelRequest,
    TableReservationResponse,
    TableReservationFilterParams
} from './reservations.types';

export const reservationsService = {
    getAll: (params?: TableReservationFilterParams) => {
        return apiClient.get<CursorPageResponse<TableReservationResponse>>('/table-reservations', { params });
    },

    create: (payload: TableReservationCreateRequest) => {
        return apiClient.post<TableReservationResponse>('/table-reservations', payload);
    },

    update: (id: string, payload: TableReservationUpdateRequest) => {
        return apiClient.patch<TableReservationResponse>(`/table-reservations/${id}`, payload);
    },

    cancel: (id: string, payload: TableReservationCancelRequest) => {
        return apiClient.post<TableReservationResponse>(`/table-reservations/${id}/cancel`, payload);
    },

    arrive: (id: string) => {
        return apiClient.post<TableReservationResponse>(`/table-reservations/${id}/arrive`);
    },

    complete: (id: string) => {
        return apiClient.post<TableReservationResponse>(`/table-reservations/${id}/complete`);
    },

    noShow: (id: string) => {
        return apiClient.post<TableReservationResponse>(`/table-reservations/${id}/no-show`);
    },
};