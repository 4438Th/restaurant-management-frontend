import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@repo/core';
import { categoriesService } from './categories.service';
import {
    MenuCategoryCreateRequest,
    MenuCategoryUpdateRequest,
    MenuCategoryFilterParams
} from './categories.types';

// ==========================================
// QUERY KEY FACTORY
// ==========================================
export const menuCategoryKeys = {
    all: ['menu', 'categories'] as const,
    lists: () => [...menuCategoryKeys.all, 'list'] as const,
    list: (params?: MenuCategoryFilterParams) => [...menuCategoryKeys.lists(), params] as const,
    trash: () => [...menuCategoryKeys.all, 'trash'] as const,
    trashList: (params?: MenuCategoryFilterParams) => [...menuCategoryKeys.trash(), params] as const,
    details: () => [...menuCategoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...menuCategoryKeys.details(), id] as const,
    analytics: () => [...menuCategoryKeys.all, 'analytics'] as const,
};

// Hằng số hỗ trợ tương thích ngược (Backward Compatibility)
export const MENU_CATEGORIES_QUERY_KEY = menuCategoryKeys.all;

// ==========================================
// HOOKS
// ==========================================

export const useMenuCategory = (params?: MenuCategoryFilterParams) => {
    return useQuery({
        queryKey: menuCategoryKeys.list(params),
        queryFn: () => categoriesService.getAll(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useMenuCategoryTrash = (params?: MenuCategoryFilterParams) => {
    return useQuery({
        queryKey: menuCategoryKeys.trashList(params),
        queryFn: () => categoriesService.getTrash(params!),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
    });
};

export const useCreateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, MenuCategoryCreateRequest>({
        mutationFn: (payload: MenuCategoryCreateRequest) => categoriesService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.analytics() });
        },
    });
};

export const useUpdateMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, { id: string; payload: MenuCategoryUpdateRequest }>({
        mutationFn: ({ id, payload }) => categoriesService.update(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.analytics() });
        },
    });
};

export const useDeleteMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.all });
        },
    });
};

export const useRestoreMenuCategory = () => {
    const queryClient = useQueryClient();
    return useMutation<unknown, ApiError, string>({
        mutationFn: (id: string) => categoriesService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: menuCategoryKeys.all });
        },
    });
};

export const useMenuCategoryAnalytics = () => {
    return useQuery({
        queryKey: menuCategoryKeys.analytics(),
        queryFn: () => categoriesService.getAnalytics(),
        staleTime: 5 * 60 * 1000,
    });
};