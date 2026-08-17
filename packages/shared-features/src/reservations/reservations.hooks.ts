import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { reservationsService } from './reservations.services';
import {
    TableReservationCreateRequest,
    TableReservationUpdateRequest,
    TableReservationCancelRequest,
    ConfirmDepositRequest,
    TableReservationFilterParams,
    TableReservationResponse,
} from './reservations.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const reservationKeys = {
    all: ['table-reservations'] as const,
    lists: () => [...reservationKeys.all, 'list'] as const,
    list: (params?: TableReservationFilterParams) => [...reservationKeys.lists(), params] as const,
    details: () => [...reservationKeys.all, 'detail'] as const,
    detail: (id: string) => [...reservationKeys.details(), id] as const,
};

// Giữ lại hằng số cũ để đảm bảo tương thích ngược (Backward Compatibility)
export const RESERVATIONS_QUERY_KEY = reservationKeys.all;

// ==========================================
// HOOKS - QUERIES
// ==========================================

export const useReservation = (params?: TableReservationFilterParams) => {
    return useQuery({
        queryKey: reservationKeys.list(params),
        queryFn: () => reservationsService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

// ==========================================
// HOOKS - MUTATIONS
// ==========================================

export const useCreateReservation = () => {
    const queryClient = useQueryClient();
    return useMutation<TableReservationResponse, ApiError, TableReservationCreateRequest>({
        mutationFn: (payload: TableReservationCreateRequest) => reservationsService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
        },
    });
};

export const useUpdateReservation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        TableReservationResponse,
        ApiError,
        { id: string; payload: TableReservationUpdateRequest }
    >({
        mutationFn: ({ id, payload }) => reservationsService.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) });
        },
    });
};

export const useConfirmDeposit = () => {
    const queryClient = useQueryClient();
    return useMutation<
        TableReservationResponse,
        ApiError,
        { id: string; payload: ConfirmDepositRequest }
    >({
        mutationFn: ({ id, payload }) => reservationsService.confirmDeposit(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) });
        },
    });
};

export const useCheckInReservation = () => {
    const queryClient = useQueryClient();
    return useMutation<TableReservationResponse, ApiError, string>({
        mutationFn: (id: string) => reservationsService.checkIn(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reservationKeys.detail(id) });
        },
    });
};

export const useCancelReservation = () => {
    const queryClient = useQueryClient();
    return useMutation<
        TableReservationResponse,
        ApiError,
        { id: string; payload: TableReservationCancelRequest }
    >({
        mutationFn: ({ id, payload }) => reservationsService.cancel(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: reservationKeys.lists() });
            queryClient.invalidateQueries({ queryKey: reservationKeys.detail(variables.id) });
        },
    });
};