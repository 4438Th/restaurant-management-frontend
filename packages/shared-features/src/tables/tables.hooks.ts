import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { tablesService } from './tables.service';
import {
    TableCreateRequest,
    TableUpdateRequest,
    TableFilterParams
} from './tables.types';

export const useTable = (params: TableFilterParams) => {
    return useQuery({
        queryKey: ['tables', params],
        queryFn: () => tablesService.getAll(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useTableTrash = (params: TableFilterParams) => {
    return useQuery({
        queryKey: ['tables/trash', params],
        queryFn: () => tablesService.getTrash(params),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, TableCreateRequest>({
        mutationFn: (payload: TableCreateRequest) => tablesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        },
    });
};

export const useUpdateTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: TableUpdateRequest }>({
        mutationFn: ({ id, payload }) => tablesService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => tablesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables'] });
            queryClient.invalidateQueries({ queryKey: ['tables/trash'] });
        },
    });
};

export const useRestoreTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => tablesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tables/trash'] });
            queryClient.invalidateQueries({ queryKey: ['tables'] });
        },
    });
};

export const useTableAnalytics = () => {
    return useQuery({
        queryKey: ['tables/analytics'],
        queryFn: () => tablesService.getAnalytics(),
        staleTime: 30 * 1000,
    });
};