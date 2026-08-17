import { apiClient, CursorPageResponse } from '@repo/core';
import {
    TableReservationCreateRequest,
    TableReservationUpdateRequest,
    TableReservationCancelRequest,
    ConfirmDepositRequest,
    TableReservationResponse,
    TableReservationFilterParams,
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

    confirmDeposit: (id: string, payload: ConfirmDepositRequest) => {
        return apiClient.put<TableReservationResponse>(`/table-reservations/${id}/confirm-deposit`, payload);
    },

    checkIn: (id: string) => {
        return apiClient.put<TableReservationResponse>(`/table-reservations/${id}/check-in`);
    },

    cancel: (id: string, payload: TableReservationCancelRequest) => {
        return apiClient.put<TableReservationResponse>(`/table-reservations/${id}/cancel`, payload);
    }
};