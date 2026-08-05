import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { dishesService } from './dishes.service';
import {
    DishCreateRequest,
    DishUpdateRequest,
    DishFilterParams
} from './dishes.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const dishKeys = {
    all: ['menu', 'dishes'] as const,
    lists: () => [...dishKeys.all, 'list'] as const,
    list: (params?: DishFilterParams) => [...dishKeys.lists(), params] as const,
    trash: () => [...dishKeys.all, 'trash'] as const,
    trashList: (params?: DishFilterParams) => [...dishKeys.trash(), params] as const,
    details: () => [...dishKeys.all, 'detail'] as const,
    detail: (id: string) => [...dishKeys.details(), id] as const,
    analytics: () => [...dishKeys.all, 'analytics'] as const,
};

export const DISHES_QUERY_KEY = dishKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const useDish = (params?: DishFilterParams) => {
    return useQuery({
        queryKey: dishKeys.list(params),
        queryFn: () => dishesService.getAll(params ?? {}), // Sửa params! thành params ?? {}
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useDishTrash = (params?: DishFilterParams) => {
    return useQuery({
        queryKey: dishKeys.trashList(params),
        queryFn: () => dishesService.getTrash(params ?? {}), // Sửa params! thành params ?? {}
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, DishCreateRequest>({
        mutationFn: (payload: DishCreateRequest) => dishesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
            queryClient.invalidateQueries({ queryKey: dishKeys.analytics() });
        },
    });
};

export const useUpdateDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: DishUpdateRequest }>({
        mutationFn: ({ id, payload }) => dishesService.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
            queryClient.invalidateQueries({ queryKey: dishKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: dishKeys.analytics() });
        },
    });
};

export const useDeleteDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => dishesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dishKeys.all });
        },
    });
};

export const useRestoreDish = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => dishesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: dishKeys.all });
        },
    });
};

export const useDishAnalytics = () => {
    return useQuery({
        queryKey: dishKeys.analytics(),
        queryFn: () => dishesService.getAnalytics(),
        staleTime: 30 * 1000,
    });
};