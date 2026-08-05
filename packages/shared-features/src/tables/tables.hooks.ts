import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { tablesService } from './tables.service';
import {
    TableCreateRequest,
    TableUpdateRequest,
    TableFilterParams
} from './tables.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const tableKeys = {
    all: ['tables'] as const,
    lists: () => [...tableKeys.all, 'list'] as const,
    list: (params?: TableFilterParams) => [...tableKeys.lists(), params] as const,
    trash: () => [...tableKeys.all, 'trash'] as const,
    trashList: (params?: TableFilterParams) => [...tableKeys.trash(), params] as const,
    analytics: () => [...tableKeys.all, 'analytics'] as const,
};

// Hằng số hỗ trợ tương thích ngược (Backward Compatibility)
export const TABLES_QUERY_KEY = tableKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const useTable = (params?: TableFilterParams) => {
    return useQuery({
        queryKey: tableKeys.list(params),
        queryFn: () => tablesService.getAll(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useTableTrash = (params?: TableFilterParams) => {
    return useQuery({
        queryKey: tableKeys.trashList(params),
        queryFn: () => tablesService.getTrash(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, TableCreateRequest>({
        mutationFn: (payload: TableCreateRequest) => tablesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
            queryClient.invalidateQueries({ queryKey: tableKeys.analytics() });
        },
    });
};

export const useUpdateTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: TableUpdateRequest }>({
        mutationFn: ({ id, payload }) => tablesService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.lists() });
            queryClient.invalidateQueries({ queryKey: tableKeys.analytics() });
        },
    });
};

export const useDeleteTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => tablesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
        },
    });
};

export const useRestoreTable = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => tablesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tableKeys.all });
        },
    });
};

export const useTableAnalytics = () => {
    return useQuery({
        queryKey: tableKeys.analytics(),
        queryFn: () => tablesService.getAnalytics(),
        staleTime: 30 * 1000,
    });
};